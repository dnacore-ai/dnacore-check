const https = require('https');
const http = require('http');

// 只認識 Schema.org 白名單型別，不回傳任何外部原始字串
const KNOWN_TYPES = new Set([
  'WebSite', 'WebPage', 'Organization', 'LocalBusiness', 'Person',
  'Product', 'Article', 'BlogPosting', 'NewsArticle', 'FAQPage',
  'BreadcrumbList', 'SiteLinksSearchBox', 'Event', 'Recipe',
  'Review', 'HowTo', 'MedicalOrganization', 'Hospital', 'Physician',
  'SoftwareApplication', 'ItemList', 'SearchAction', 'Service'
]);

async function fetchHtml(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { timeout: 10000 }, (res) => {
      let body = '';
      let size = 0;
      res.on('data', (d) => {
        size += d.length;
        if (size > 512 * 1024) { req.destroy(); resolve(body); return; }
        body += d;
      });
      res.on('end', () => resolve(body));
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

function extractJsonLdBlocks(html) {
  const blocks = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1]);
      blocks.push(parsed);
    } catch {
      // 格式錯誤的 block 略過
    }
  }
  return blocks;
}

function flattenNodes(blocks) {
  const nodes = [];
  for (const b of blocks) {
    const top = Array.isArray(b) ? b : [b];
    for (const item of top) {
      nodes.push(item);
      // 展開 @graph（dnacore.ai 等網站常用此格式）
      if (item && item['@graph']) {
        const graph = Array.isArray(item['@graph']) ? item['@graph'] : [item['@graph']];
        nodes.push(...graph);
      }
    }
  }
  return nodes;
}

function collectTypes(blocks) {
  const types = [];
  for (const node of flattenNodes(blocks)) {
    if (node && node['@type']) {
      const t = node['@type'];
      const candidates = Array.isArray(t) ? t : [t];
      for (const c of candidates) {
        if (typeof c === 'string' && KNOWN_TYPES.has(c)) {
          types.push(c);
        }
      }
    }
  }
  return [...new Set(types)];
}

async function checkJsonLd(origin) {
  const html = await fetchHtml(origin + '/');

  if (!html) {
    return { found: false, valid: false, score: 0, detail: 'JSON-LD 無法讀取首頁' };
  }

  const blocks = extractJsonLdBlocks(html);

  if (blocks.length === 0) {
    // 嘗試找未解析的 block（格式錯誤）
    const rawMatch = html.match(/application\/ld\+json/i);
    if (rawMatch) {
      return { found: true, valid: false, score: 3, detail: 'JSON-LD 存在但格式錯誤' };
    }
    return { found: false, valid: false, score: 0, detail: '未找到 JSON-LD 結構化資料' };
  }

  const types = collectTypes(blocks);
  const allNodes = flattenNodes(blocks);
  const hasContext = allNodes.some(i => i && (i['@context'] || '').includes('schema.org'));
  const hasName = allNodes.some(i => i && typeof i.name === 'string' && i.name.length > 0);
  const hasDescription = allNodes.some(i => i && typeof i.description === 'string' && i.description.length > 0);

  let score = 5; // 存在
  if (hasContext) score += 2;
  if (types.length > 0) score += 3;
  if (hasName || hasDescription) score += 3;
  if (hasName && hasDescription) score += 2; // 齊全加分

  const typeStr = types.length > 0 ? types.join(', ') : '未知型別';
  const detail = `JSON-LD 有效（${typeStr}）`;

  return { found: true, valid: true, score, detail, types };
}

module.exports = { checkJsonLd };
