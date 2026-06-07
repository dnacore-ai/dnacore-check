const https = require('https');
const http = require('http');

async function fetch(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { timeout: 8000 }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

async function checkLlmsTxt(origin) {
  const url = `${origin}/llms.txt`;
  const res = await fetch(url);

  if (!res || res.status !== 200) {
    return { found: false, valid: false, score: 0, detail: 'llms.txt 不存在' };
  }

  const body = res.body;
  const lines = body.split('\n').map(l => l.trim()).filter(Boolean);

  // 基本驗證：至少有一個 # 標題和一個連結
  const hasHeading = lines.some(l => l.startsWith('#'));
  const hasLink = lines.some(l => l.includes('http'));

  if (!hasHeading && !hasLink) {
    return { found: true, valid: false, score: 15, detail: 'llms.txt 存在但格式不符規格' };
  }

  // 計算完整度
  const hasDescription = lines.some(l => l.startsWith('>'));
  const linkCount = lines.filter(l => l.includes('http')).length;

  let score = 30;
  if (hasDescription) score += 5;
  if (linkCount >= 3) score += 5;

  return {
    found: true,
    valid: true,
    score,
    detail: `llms.txt 有效（${linkCount} 個連結${hasDescription ? '，有描述' : ''}）`
  };
}

module.exports = { checkLlmsTxt };
