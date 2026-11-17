---
title: "My Own AI Assistant on Telegram: OpenClaw + Ollama on Omarchy"
date: 2026-10-08
tags: ["post", "genai", "agents", "ollama", "omarchy", "guides"]
---

I wanted to message my own AI assistant from my phone without sending every prompt to a cloud model. So I wired a Telegram bot to an agent on my [Omarchy](/blog/omarchy-setup/) laptop, with [Ollama](/blog/ollama-local-llms/) serving the model locally. The agent can use tools on the machine, and I don't have to open a port to the public internet.

The thing holding it together is **OpenClaw**. It connects chat apps to local agents through a gateway. Below is how I set it up, including the terminal output and the security decisions I don't want to forget next time.

<figure><img src="/img/blog/diagram-openclaw-arch.png" alt="Phone, Telegram, OpenClaw gateway, agent loop, Ollama" loading="lazy"><figcaption>The gateway polls Telegram over HTTPS, so nothing on the laptop is exposed to the internet.</figcaption></figure>

## What you need

- Ollama running with a model that supports **tool calling** (`ollama show <model>` lists `tools` under capabilities).
- **Node 24.16+** (OpenClaw won't install on Node 22). On Omarchy: `mise use -g node@24`.
- A Telegram account.

## 1. Install OpenClaw

```bash
npm install -g openclaw@latest --allow-scripts=openclaw
openclaw --version
```

<figure><img src="/img/blog/term-oc_install.png" alt="Installing OpenClaw with npm" loading="lazy"><figcaption>On npm 11.16+ and 12, <code>--allow-scripts=openclaw</code> lets its install scripts run.</figcaption></figure>

There's also a one-line installer (`curl -fsSL https://openclaw.ai/install.sh | bash`) and, if Ollama is already set up, `ollama launch openclaw` does the install, model pick and onboarding in one go.

## 2. Onboard it with Ollama as the model

```bash
openclaw onboard --install-daemon
```

The wizard asks for a model provider (choose **Ollama**), detects your local models, writes `~/.openclaw/openclaw.json`, and installs the gateway as a systemd user service so it starts on login. The scriptable version of the same thing:

<figure><img src="/img/blog/term-oc_onboard.png" alt="openclaw onboard with Ollama, then models list" loading="lazy"><figcaption>Onboarding found the local Ollama model and made it the default.</figcaption></figure>

The relevant part of the config it writes:

```json
{
  "agents": { "defaults": { "model": { "primary": "ollama/qwen3:0.6b" } } },
  "models": {
    "providers": {
      "ollama": { "baseUrl": "http://127.0.0.1:11434", "api": "ollama" }
    }
  },
  "gateway": { "mode": "local", "port": 18789, "bind": "loopback" }
}
```

Keep `bind` on `loopback`. The gateway can run tools on your machine, so only local clients should reach it.

## 3. Check the gateway is up

```bash
openclaw gateway status
openclaw status
```

<figure><img src="/img/blog/term-oc_gateway.png" alt="openclaw gateway status output" loading="lazy"><figcaption>Loopback-only and reachable. The dashboard lives at <code>http://127.0.0.1:18789/</code>.</figcaption></figure>

## 4. Create the Telegram bot

1. In Telegram, open a chat with **@BotFather** (check the handle exactly).
2. Send `/newbot`, pick a display name and a username ending in `bot`.
3. Copy the token it gives you. Treat it like a password.

## 5. Connect the bot to OpenClaw

```bash
openclaw channels add --channel telegram --token <your-bot-token>
openclaw channels status --probe
```

Or put it in `~/.openclaw/openclaw.json` yourself:

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "123456:ABC...",
      "dmPolicy": "pairing",
      "groups": { "*": { "requireMention": true } }
    }
  }
}
```

The running gateway hot-reloads the change. `dmPolicy: "pairing"` is the important line: strangers who find your bot can't talk to your agent until you approve them.

## 6. Pair your own account

Send your bot any message from your phone. That creates a pairing request. Approve it on the laptop:

```bash
openclaw pairing list telegram
openclaw pairing approve telegram <CODE>
```

Codes expire after an hour. Once approved, every message you send the bot goes to the agent, and its reply comes back in the chat.

## 7. Make the local model good enough

This is where most local setups fall over:

- **Context window.** OpenClaw's system prompt, tools and memory need room. Ollama's docs recommend at least 64k tokens for local models. Set `OLLAMA_CONTEXT_LENGTH=65536` on the Ollama service ([how](/blog/ollama-local-llms/)).
- **But context costs RAM.** On an 8 GB test box, a 32k context got the model killed mid-load, and the agent just reported `provider internal error, HTTP 500`. If you see that, check `journalctl -u ollama` for a killed runner and lower the context or use a smaller model.
- **Model size.** Tiny models can call tools but make poor decisions. Use the biggest tool-capable model your GPU runs comfortably, and keep a small one for quick tests.
- **Keep it warm.** `OLLAMA_KEEP_ALIVE=30m` stops the first message after a break from waiting for a model load.

## 8. Day-to-day commands

| Command | Use |
| --- | --- |
| `openclaw status` | Health, sessions, channels at a glance |
| `openclaw logs --follow` | Watch messages and tool calls live |
| `openclaw models list` | Which model the agent uses |
| `openclaw doctor` | Find and fix config problems |
| `openclaw gateway stop` | Stop the gateway |
| `openclaw security audit` | Check what the agent is allowed to do |

## Guardrails I'd keep

- Keep pairing on and allow only your own Telegram user ID. A bot that can touch your laptop should not respond to random strangers.
- Gateway on loopback, no port forwarding.
- Run `openclaw security audit` after changing tools or skills, and keep risky tools behind approvals.
- Keep the bot token and gateway token out of screenshots and git. None of the ones here show either.

Underneath the Telegram interface, this is still the same loop from my [AI agents guide](/blog/ai-agents-guide/). Giving it a chat app doesn't make it smarter or safer. The tool permissions and approvals are what matter.
