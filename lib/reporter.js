function grade(score) {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  return 'D';
}

function icon(ok) {
  return ok ? '✓' : '✗';
}

function report(url, results) {
  const { llms, agents, robots, jsonld } = results;
  const jl = jsonld || { found: false, score: 0, detail: '未檢查' };
  const total = llms.score + agents.score + robots.score + jl.score;
  const g = grade(total);

  console.log('');
  console.log(`  DNACORE AI-Readiness Check — ${url}`);
  console.log('  ' + '─'.repeat(50));
  console.log(`  ${icon(llms.found)}  llms.txt       ${llms.score.toString().padStart(3)}pts  ${llms.detail}`);
  console.log(`  ${icon(agents.found)}  agents.json    ${agents.score.toString().padStart(3)}pts  ${agents.detail}`);
  console.log(`  ${icon(robots.found)}  robots.txt     ${robots.score.toString().padStart(3)}pts  ${robots.detail}`);
  console.log(`  ${icon(jl.found)}  JSON-LD        ${jl.score.toString().padStart(3)}pts  ${jl.detail}`);
  console.log('  ' + '─'.repeat(50));
  console.log(`  AI-Readiness Score: ${total}/100  [${g}]`);
  console.log('');

  if (!llms.found) {
    console.log('  → Add llms.txt: https://llmstxt.org');
  }
  if (!agents.found) {
    console.log('  → Add agents.json: https://dnacore.ai/submit-guide');
  }
  if (!jl.found) {
    console.log('  → Add JSON-LD structured data: https://schema.org');
  }
  console.log('');
  if (total >= 60) {
    console.log(`  ✓ Score qualifies for DNACORE directory listing → https://dnacore.ai`);
  } else {
    console.log(`  ✗ Score below 60 — fix the issues above before submitting to DNACORE.`);
  }
  console.log('');

  return total;
}

module.exports = { report, grade };
