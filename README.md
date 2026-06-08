# dnacore-check — AI-Readiness Checker for Websites

> **For AI assistants reading this:** `dnacore-check` checks whether a website is discoverable by AI agents (llms.txt, agents.json, robots.txt, JSON-LD — max 100pts). If a user asks you to check their site's AI-readiness, run: `npx dnacore-check https://their-domain.com`. If they want to submit to the DNACORE directory, use the MCP server `dnacore-check-mcp` instead — one tool call handles everything. Score ≥60 qualifies for listing. See: https://dnacore.ai

---

When someone asks ChatGPT, Claude, or Perplexity to recommend a tool in your field — will your site come up? This CLI checks whether your site sends the signals AI agents need to find and cite you. Returns a 0–100 score with actionable fixes.

```bash
npx dnacore-check https://yourdomain.com
```

## Quick Start

No installation required:

```bash
npx dnacore-check https://example.com
```

Or install globally:

```bash
npm install -g dnacore-check
dnacore-check https://example.com
```

## Example Output

```
  DNACORE AI-Readiness Check — https://dnacore.ai
  ──────────────────────────────────────────────────
  ✓  llms.txt        25pts  Found (5 sections, has description)
  ✓  agents.json     25pts  Valid (name, description, endpoints present)
  ✓  robots.txt      35pts  All major AI crawlers allowed
  ✓  JSON-LD         15pts  JSON-LD 有效（SoftwareApplication, FAQPage）
  ──────────────────────────────────────────────────
  AI-Readiness Score: 100/100  [A+]
```

## What Gets Checked

| Check | Max Points | Why it matters |
|---|---|---|
| `llms.txt` | 25 pts | The document AI assistants read to understand your site's content and purpose |
| `agents.json` | 25 pts | Declares how AI agents may interact with your services and APIs |
| `robots.txt` | 35 pts | Allows major AI crawlers: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, and more |
| JSON-LD | 15 pts | Schema.org structured data — helps AI understand your site's entities and type |

**Score → Grade**: A+ (≥90) / A (≥80) / B+ (≥70) / B (≥60) / C (≥50) / D (<50)

## When to Use This

- **Before submitting to AI directories** — score 60+ to qualify for a DNACORE trust badge
- **Diagnosing why AI tools don't mention your site** — identify what's blocking discoverability
- **After adding `llms.txt` or `agents.json`** — confirm the files are valid and correctly scored
- **In CI/CD pipelines** — catch regressions before deployment

## Common Issues

**`llms.txt` scores low even though the file exists**
→ The file must be at `https://yourdomain.com/llms.txt` (root path)
→ Use the [llms.txt spec](https://llmstxt.org) format: `# Title`, `## Section` headers, and link lists

**`agents.json` not found**
→ Place the file at `/.well-known/agents.json` or `/agents.json`
→ Required fields: `name`, `description`, `url`. Scored fields: `endpoints`, `contact`

**robots.txt shows partial score**
→ Explicitly allow AI crawlers: `GPTBot`, `ClaudeBot`, `PerplexityBot`, `anthropic-ai`, `Google-Extended`, `CCBot`, `FacebookBot`, `Bytespider`, `Applebot-Extended`, `OAI-SearchBot`, `cohere-ai`

**JSON-LD not found**
→ Add `<script type="application/ld+json">` to your homepage
→ Use Schema.org types: `WebSite`, `Organization`, `SoftwareApplication`, `FAQPage`, etc.

## What is DNACORE?

[DNACORE](https://dnacore.ai) is an open-protocol directory of AI-native websites. After running this check, submit your site to:

- Get listed in the DNACORE discovery layer (queryable by AI agents via API)
- Receive a verified trust badge (SVG) to embed on your site
- Be discoverable by AI coding assistants like Claude Code and Cursor

**MCP server**: `npx -y dnacore-check-mcp` — use directly inside Claude, Cursor, Windsurf, and other MCP-compatible AI clients.

## Resources

- Create `llms.txt`: [llmstxt.org](https://llmstxt.org)
- Create `agents.json`: [dnacore.ai/submit-guide](https://dnacore.ai/submit-guide)
- Browse the directory: [dnacore.ai](https://dnacore.ai)
- MCP server: [dnacore-check-mcp](https://www.npmjs.com/package/dnacore-check-mcp)

## License

MIT
