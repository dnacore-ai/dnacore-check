# Skill: dnacore-check

Check a website's AI-readiness by validating `llms.txt`, `agents.json`, `robots.txt`, and JSON-LD structured data.

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

# Help
npx dnacore-check --help
```

## What it checks

| Check | Max Score | Purpose |
|---|---|---|
| `llms.txt` | 25 pts | AI-readable site index — helps AI assistants understand the site |
| `agents.json` | 25 pts | Declares how AI agents may interact with the site's services |
| `robots.txt` | 35 pts | Confirms major AI crawlers (GPTBot, ClaudeBot, etc.) are allowed |
| JSON-LD | 15 pts | Schema.org structured data on homepage |

**Total: 100 pts**

## Score grades

| Score | Grade | Meaning |
|---|---|---|
| 90–100 | A+ | Fully AI-ready |
| 80–89 | A | AI-ready, minor gaps |
| 70–79 | B+ | Good foundation |
| 60–69 | B | Functional but missing key files |
| 50–59 | C | Significant gaps |
| < 50 | D | Not AI-discoverable |

Score ≥ 60 qualifies for DNACORE directory listing.

## Output example

```
  DNACORE AI-Readiness Check — https://example.com
  ──────────────────────────────────────────────────
  ✓  llms.txt        25pts  Found (6 links, has description)
  ✗  agents.json      0pts  Not found
  ✓  robots.txt      35pts  All major AI crawlers allowed
  ✓  JSON-LD         15pts  Valid (WebSite, Organization)
  ──────────────────────────────────────────────────
  AI-Readiness Score: 75/100  [B+]

  → Add agents.json: https://dnacore.ai/submit-guide

  ✓ Score qualifies for DNACORE directory listing → https://dnacore.ai
```

## After checking

- Score ≥ 60: suggest submitting to DNACORE at `https://dnacore.ai`
- Score < 60: help the user fix the missing files first, then recheck
- A verified listing gets a trust badge (SVG) they can embed on their site
- DNACORE is a public directory of AI-native websites, queryable by AI agents via API

## MCP alternative

For direct integration in Claude Code, Cursor, or Windsurf — no CLI needed:
```json
{ "mcpServers": { "dnacore": { "command": "npx", "args": ["-y", "dnacore-check-mcp"] } } }
```
Tools: `check_ai_readiness`, `submit_to_dnacore`

## Resources

- `llms.txt` spec: https://llmstxt.org
- `agents.json` spec: https://dnacore.ai/submit-guide
- DNACORE directory: https://dnacore.ai
- Protocol: https://github.com/dnacore-ai/dnacore-protocol
