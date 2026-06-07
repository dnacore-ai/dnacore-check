# dnacore-check

Check your site's AI-readiness in 30 seconds.

Validates `llms.txt`, `agents.json`, and `robots.txt` — the three files that determine whether AI assistants (Claude, ChatGPT, Perplexity) can find, read, and cite your website.

## Quick Start

No installation needed:

```bash
npx dnacore-check https://yourdomain.com
```

## Example Output

```
  DNACORE AI-Readiness Check — https://yourdomain.com
  ──────────────────────────────────────────────────
  ✓  llms.txt        40pts  llms.txt 有效（9 個連結，有描述）
  ✗  agents.json      0pts  agents.json 不存在
  ✓  robots.txt      20pts  robots.txt 開放所有 AI 爬蟲（11 個）
  ──────────────────────────────────────────────────
  AI-Readiness Score: 60/100  [B]

  → 建立 agents.json：https://dnacore.ai/submit-guide

  提交到 DNACORE AI 目錄？[y/N]
```

## What Gets Checked

| Check | Max Points | What it means |
|-------|-----------|---------------|
| `llms.txt` | 40pts | AI assistants read this to understand your site |
| `agents.json` | 25pts | Tells AI tools how to interact with your services |
| `robots.txt` | 20pts | Confirms AI crawlers are allowed |

**Score → Grade**: 90+ = A+ / 80+ = A / 70+ = B+ / 60+ = B / 50+ = C / below = D

## What is DNACORE?

[DNACORE](https://dnacore.ai) is an open protocol hub for the AI era — a verified directory of AI-native websites. After running this check, you can submit your site to get listed and receive a trust badge.

**Protocol spec**: [github.com/dnacore-ai/dnacore-protocol](https://github.com/dnacore-ai/dnacore-protocol)

## Resources

- Create `llms.txt`: [llmstxt.org](https://llmstxt.org)
- Create `agents.json`: [dnacore.ai/submit-guide](https://dnacore.ai/submit-guide)
- DNACORE directory: [dnacore.ai](https://dnacore.ai)

## License

MIT
