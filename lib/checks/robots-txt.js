const https = require('https');
const http = require('http');

const AI_BOTS = [
  'GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended',
  'Bingbot', 'Applebot', 'AmazonBot', 'anthropic-ai',
  'CCBot', 'cohere-ai', 'Diffbot'
];

async function fetch(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { timeout: 8000 }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

async function checkRobotsTxt(origin) {
  const url = `${origin}/robots.txt`;
  const res = await fetch(url);

  if (!res || res.status !== 200) {
    return { found: false, score: 0, allowed: [], blocked: [], detail: 'robots.txt 不存在' };
  }

  const body = res.body;
  const lines = body.split('\n').map(l => l.trim());

  // 解析 User-agent + Disallow/Allow 規則
  let currentAgents = [];
  const rules = {};

  for (const line of lines) {
    if (line.toLowerCase().startsWith('user-agent:')) {
      const agent = line.split(':')[1].trim();
      currentAgents = [agent];
      if (!rules[agent]) rules[agent] = { disallow: [], allow: [] };
    } else if (line.toLowerCase().startsWith('disallow:')) {
      const path = line.split(':')[1]?.trim() || '';
      currentAgents.forEach(a => rules[a]?.disallow.push(path));
    } else if (line.toLowerCase().startsWith('allow:')) {
      const path = line.split(':')[1]?.trim() || '';
      currentAgents.forEach(a => rules[a]?.allow.push(path));
    } else if (line === '') {
      currentAgents = [];
    }
  }

  // 判斷每個 AI bot 是否被允許
  const allowed = [];
  const blocked = [];

  for (const bot of AI_BOTS) {
    const botRules = rules[bot] || rules['*'];
    if (!botRules) { allowed.push(bot); continue; }
    const isBlocked = botRules.disallow.some(p => p === '/' || p === '/*');
    if (isBlocked) blocked.push(bot);
    else allowed.push(bot);
  }

  const allAllowed = blocked.length === 0;
  const score = allAllowed ? 20 : Math.round(20 * allowed.length / AI_BOTS.length);

  return {
    found: true,
    score,
    allowed,
    blocked,
    detail: allAllowed
      ? `robots.txt 開放所有 AI 爬蟲（${AI_BOTS.length} 個）`
      : `${blocked.length} 個 AI 爬蟲被封鎖：${blocked.join(', ')}`
  };
}

module.exports = { checkRobotsTxt };
