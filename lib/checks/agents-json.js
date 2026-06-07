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

async function checkAgentsJson(origin) {
  const url = `${origin}/.well-known/agents.json`;
  const res = await fetch(url);

  if (!res || res.status !== 200) {
    return { found: false, valid: false, score: 0, detail: 'agents.json 不存在' };
  }

  let data;
  try {
    data = JSON.parse(res.body);
  } catch {
    return { found: true, valid: false, score: 8, detail: 'agents.json 存在但 JSON 格式錯誤' };
  }

  const hasName = !!data.name;
  const hasEndpoints = Array.isArray(data.endpoints) && data.endpoints.length > 0;
  const hasVersion = !!data.schema_version || !!data.version;

  let score = 15;
  if (hasName) score += 3;
  if (hasEndpoints) score += 5;
  if (hasVersion) score += 2;

  const missing = [];
  if (!hasName) missing.push('name');
  if (!hasEndpoints) missing.push('endpoints');
  if (!hasVersion) missing.push('schema_version');

  return {
    found: true,
    valid: true,
    score,
    detail: missing.length
      ? `agents.json 有效，缺少欄位：${missing.join(', ')}`
      : 'agents.json 完整'
  };
}

module.exports = { checkAgentsJson };
