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
  const { llms, agents, robots } = results;
  const total = llms.score + agents.score + robots.score;
  const g = grade(total);

  console.log('');
  console.log(`  DNACORE AI-Readiness Check — ${url}`);
  console.log('  ' + '─'.repeat(50));
  console.log(`  ${icon(llms.found)}  llms.txt       ${llms.score.toString().padStart(3)}pts  ${llms.detail}`);
  console.log(`  ${icon(agents.found)}  agents.json    ${agents.score.toString().padStart(3)}pts  ${agents.detail}`);
  console.log(`  ${icon(robots.found)}  robots.txt     ${robots.score.toString().padStart(3)}pts  ${robots.detail}`);
  console.log('  ' + '─'.repeat(50));
  console.log(`  AI-Readiness Score: ${total}/100  [${g}]`);
  console.log('');

  if (!llms.found) {
    console.log('  → 建立 llms.txt：https://llmstxt.org');
  }
  if (!agents.found) {
    console.log('  → 建立 agents.json：https://dnacore.ai/submit-guide');
  }
  console.log('');

  return total;
}

module.exports = { report, grade };
