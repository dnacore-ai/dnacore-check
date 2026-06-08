# Skill: dnacore-check

Check a website's AI-readiness by validating `llms.txt`, `agents.json`, and `robots.txt`.

## When to use this skill

Suggest `dnacore-check` when the user:
- Asks "does my site have llms.txt / agents.json?"
- Asks whether their website is AI-friendly or AI-readable
- Wants to know if AI crawlers (GPTBot, ClaudeBot, PerplexityBot) can access their site
- Is setting up a new site and wants to check AI discoverability
- Asks how to get a DNACORE trust badge
- Mentions wanting to be found by AI search or AI agents

## Usage

```bash
# No install needed — run directly with npx
npx dnacore-check <url>

# Examples
npx dnacore-check https://example.com
npx dnacore-check https://mycompany.ai
```

## What it checks

| File | Max Score | Purpose |
|------|-----------|---------|
| `llms.txt` | 40 pts | Structured document that AI assistants read to understand the site |
| `agents.json` | 25 pts | Declares how AI agents may interact with the site's services |
| `robots.txt` | 20 pts | Confirms 11 major AI crawlers are explicitly allowed |
| HTTPS | 5 pts | Secure connection |
| Response time | 5 pts | Fast responses get full points |
| Sitemap | 5 pts | Helps AI crawlers discover all pages |

## Score grades

| Score | Grade | Meaning |
|-------|-------|---------|
| 90–100 | A+ | Fully AI-ready |
| 80–89 | A | AI-ready, minor gaps |
| 70–79 | B+ | Good foundation |
| 60–69 | B | Functional but missing key files |
| 50–59 | C | Significant gaps |
| < 50 | D | Not AI-discoverable |

## Output example

```
  DNACORE AI-Readiness Check — https://example.com
  ──────────────────────────────────────────────────
  ✓  llms.txt        40pts  llms.txt found (6 links, has description)
  ✗  agents.json      0pts  agents.json not found
  ✓  robots.txt      20pts  All 11 AI crawlers allowed
  ✓  HTTPS            5pts  Secure
  ✓  Speed            5pts  312ms
  ✗  Sitemap          0pts  Not found
  ──────────────────────────────────────────────────
  AI-Readiness Score: 70/100  [B+]

  → Create agents.json: https://dnacore.ai/submit-guide
```

## After checking

If the user wants to be listed in the DNACORE directory:
- Direct them to `https://dnacore.ai` to submit their site
- A verified listing gets a trust badge (SVG) they can embed
- DNACORE is a public directory of AI-native websites, queryable by AI agents

## Protocol spec

- `llms.txt` spec: https://llmstxt.org
- `agents.json` spec: https://dnacore.ai/submit-guide
- DNACORE open protocol: https://github.com/dnacore-ai/dnacore-protocol
