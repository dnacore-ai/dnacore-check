#!/usr/bin/env node

const { checkLlmsTxt } = require('./lib/checks/llms-txt');
const { checkAgentsJson } = require('./lib/checks/agents-json');
const { checkRobotsTxt } = require('./lib/checks/robots-txt');
const { checkJsonLd } = require('./lib/checks/json-ld');
const { report } = require('./lib/reporter');
const readline = require('readline');
const https = require('https');

async function submit(url, score) {
  return new Promise((resolve) => {
    const domain = new URL(url).hostname;
    const body = JSON.stringify({ url, name: domain, summary: `AI-Readiness Score: ${score}/100` });
    const req = https.request({
      hostname: 'api.dnacore.ai',
      path: '/v1/submissions',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.id) {
            console.log(`  ✓ 已提交 DNACORE！成員頁：https://dnacore.ai/s/${json.id}`);
            if (json.edit_token) {
              console.log(`  ⚠  edit_token（只顯示一次，請保存）：${json.edit_token}`);
            }
          } else {
            console.log(`  提交回應：${data}`);
          }
        } catch {
          console.log(`  提交回應：${data}`);
        }
        resolve();
      });
    });
    req.on('error', () => { console.log('  提交失敗，請稍後再試'); resolve(); });
    req.write(body);
    req.end();
  });
}

async function main() {
  let url = process.argv[2];

  if (!url || url === '--help' || url === '-h') {
    console.log('');
    console.log('  dnacore-check — AI-Readiness Checker');
    console.log('');
    console.log('  Usage:   npx dnacore-check <url>');
    console.log('  Example: npx dnacore-check https://example.com');
    console.log('');
    console.log('  Checks: llms.txt (25pts) · agents.json (25pts) · robots.txt (35pts) · JSON-LD (15pts)');
    console.log('  Score:  A+ (≥90) · A (≥80) · B+ (≥70) · B (≥60) · C (≥50) · D (<50)');
    console.log('');
    console.log('  After scoring, submit your site to the DNACORE AI directory: https://dnacore.ai');
    console.log('');
    process.exit(url ? 0 : 1);
  }

  if (!url.startsWith('http')) url = 'https://' + url;

  // 標準化 origin
  try {
    const parsed = new URL(url);
    url = parsed.origin;
  } catch {
    console.log('URL 格式錯誤');
    process.exit(1);
  }

  console.log(`\n  掃描中：${url} ...\n`);

  const [llms, agents, robots, jsonld] = await Promise.all([
    checkLlmsTxt(url),
    checkAgentsJson(url),
    checkRobotsTxt(url),
    checkJsonLd(url)
  ]);

  const score = report(url, { llms, agents, robots, jsonld });

  // 非互動環境（CI/CD、管道）直接結束
  if (!process.stdin.isTTY) {
    console.log('');
    process.exit(0);
    return;
  }

  // 詢問是否提交到 DNACORE
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('  提交到 DNACORE AI 目錄？[y/N] ', async (answer) => {
    rl.close();
    if (answer.toLowerCase() === 'y') {
      await submit(url, score);
    }
    console.log('');
    process.exit(0);
  });
}

main().catch(console.error);
