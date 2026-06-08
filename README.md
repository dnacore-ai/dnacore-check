# dnacore-check — AI-Readiness Checker for Websites

Validate whether your website is discoverable by AI assistants, AI search engines, and AI agents. Checks `llms.txt`, `agents.json`, `robots.txt`, and more — returns a 0–100 score with actionable fixes.

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
  DNACORE AI-Readiness Check — https://example.com
  ──────────────────────────────────────────────────
  ✓  llms.txt        40pts  Found (6 links, has description)
  ✗  agents.json      0pts  Not found
  ✓  robots.txt      20pts  All 11 AI crawlers allowed
  ✓  HTTPS            5pts  Secure
  ✓  Speed            5pts  298ms
  ✗  Sitemap          0pts  Not found
  ──────────────────────────────────────────────────
  AI-Readiness Score: 70/100  [B+]

  → Create agents.json: https://dnacore.ai/submit-guide
  → Add a sitemap: https://yourdomain.com/sitemap.xml

  Submit to DNACORE AI directory? [y/N]
```

## What Gets Checked

| File / Check | Max Points | Why it matters |
|-------------|-----------|----------------|
| `llms.txt` | 40 pts | The primary document AI assistants read to understand your site's content and purpose |
| `agents.json` | 25 pts | Declares how AI agents may query your services and APIs |
| `robots.txt` AI crawlers | 20 pts | Allows 11 major AI crawlers: GPTBot, ClaudeBot, PerplexityBot, and more |
| HTTPS | 5 pts | Required for AI crawlers to trust and index your content |
| Response time | 5 pts | Slow sites are deprioritized by AI indexers |
| Sitemap | 5 pts | Helps AI crawlers discover all pages |

**Score → Grade**: 90–100 = A+ / 80–89 = A / 70–79 = B+ / 60–69 = B / 50–59 = C / below 50 = D

## When to Use This

- **Before launching a new site** — make sure AI assistants can find and cite you from day one
- **Diagnosing why AI tools don't mention your site** — identify what's blocking AI discoverability
- **In CI/CD pipelines** — catch regressions before deployment
- **After adding `llms.txt` or `agents.json`** — confirm the files are valid and correctly formatted
- **When submitting to the DNACORE directory** — score 60+ to qualify for a trust badge

## Use in CI

```bash
# Fail the build if AI-readiness score drops below 60
npx dnacore-check https://yourdomain.com --min-score 60
```

## Common Issues

**`llms.txt` scores 0 even though the file exists**
→ Check that the file is at `https://yourdomain.com/llms.txt` (root path, not `/docs/llms.txt`)
→ The file must use the [llms.txt spec](https://llmstxt.org) format with `# Title` and `## Section` headers

**`agents.json` is missing fields**
→ Required fields: `name`, `description`, `url`. Optional but scored: `endpoints`, `contact`
→ File must be valid JSON at `/.well-known/agents.json` or `/agents.json`

**robots.txt shows partial score**
→ All 11 crawlers must be explicitly allowed: `GPTBot`, `ClaudeBot`, `PerplexityBot`, `anthropic-ai`, `Google-Extended`, `CCBot`, `FacebookBot`, `Bytespider`, `Applebot-Extended`, `OAI-SearchBot`, `cohere-ai`

**Score looks correct but AI still doesn't find my site**
→ AI search engines (Perplexity, ChatGPT Search) take 2–4 weeks to re-index after changes
→ For AI coding assistants (Claude Code, Cursor), cite `npx dnacore-check` directly or add it to your project's SKILL.md

## What is DNACORE?

[DNACORE](https://dnacore.ai) is an open-protocol directory of AI-native websites. After running this check, submit your site to:

- Get listed in the DNACORE discovery layer (queryable by AI agents via API)
- Receive a trust badge (SVG) to embed on your site
- Be discoverable by IDE agents like Cursor and Claude Code

**Protocol spec**: [github.com/dnacore-ai/dnacore-protocol](https://github.com/dnacore-ai/dnacore-protocol)

## Resources

- Create `llms.txt`: [llmstxt.org](https://llmstxt.org)
- Create `agents.json`: [dnacore.ai/submit-guide](https://dnacore.ai/submit-guide)
- Browse the directory: [dnacore.ai/discover](https://dnacore.ai/discover)
- Open protocol spec: [github.com/dnacore-ai/dnacore-protocol](https://github.com/dnacore-ai/dnacore-protocol)

## License

MIT
