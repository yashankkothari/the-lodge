---
title: "My Own AI Assistant on Telegram: OpenClaw + Ollama on Omarchy"
date: 2026-10-08
tags: ["post", "genai", "agents", "ollama", "omarchy", "guides"]
---

I wanted to message my own AI assistant from my phone without sending every prompt to a cloud model. So I wired a Telegram bot to an agent on my [Omarchy](/blog/omarchy-setup/) laptop, with [Ollama](/blog/ollama-local-llms/) serving the model locally. The agent can use tools on the machine, and I don't have to open a port to the public internet.

The thing holding it together is **OpenClaw**. It connects chat apps to local agents through a gateway. Below is how I set it up, including the terminal output and the security decisions I don't want to forget next time.

<figure><img src="/img/blog/diagram-openclaw-arch.png" alt="Phone, Telegram, OpenClaw gateway, agent loop, Ollama" loading="lazy"><figcaption>The gateway polls Telegram over HTTPS, so nothing on the laptop is exposed to the internet.</figcaption></figure>

## What you need

- A working Ollama server with a tool-capable model. Check `ollama show <model>` for `tools` before wondering why the agent can't call anything.
- A supported Node version—this setup expects **Node 24.16+**, not Node 22. On Omarchy I use `mise use -g node@24`.
- Your normal Telegram account, since that's how you'll talk to the bot.

## 1. Install OpenClaw

```bash
npm install -g openclaw@latest --allow-scripts=openclaw
openclaw --version
```

<figure><img src="/img/blog/term-oc_install.png" alt="Installing OpenClaw with npm" loading="lazy"><figcaption>On npm 11.16+ and 12, <code>--allow-scripts=openclaw</code> lets its install scripts run.</figcaption></figure>

There are shortcuts: OpenClaw has a shell installer (`curl -fsSL https://openclaw.ai/install.sh | bash`), and `ollama launch openclaw` can handle model selection and onboarding. I prefer knowing the individual steps before letting an installer configure an agent that can touch my files. Read remote scripts before running them.

## 2. Onboard it with Ollama as the model

```bash
openclaw onboard --install-daemon
```

The onboarding wizard asks which provider to use; I chose **Ollama**. It finds the models already on the machine, writes the config to `~/.openclaw/openclaw.json` and sets the gateway up as a systemd user service. That saves a fair amount of manual plumbing. The screenshot shows the equivalent configuration flow.

<figure><img src="/img/blog/term-oc_onboard.png" alt="openclaw onboard with Ollama, then models list" loading="lazy"><figcaption>Onboarding found the local Ollama model and made it the default.</figcaption></figure>

These are the settings I actually care about when checking what the wizard wrote:

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

Don't casually change `bind` away from `loopback`. This gateway may be able to run commands or access files on your laptop. Exposing that interface to the network is a much bigger decision than exposing a normal web dashboard.

## 3. Check the gateway is up

```bash
openclaw gateway status
openclaw status
```

<figure><img src="/img/blog/term-oc_gateway.png" alt="openclaw gateway status output" loading="lazy"><figcaption>Loopback-only and reachable. The dashboard lives at <code>http://127.0.0.1:18789/</code>.</figcaption></figure>

## 4. Create the Telegram bot

1. Open Telegram and make sure you're talking to the actual **@BotFather** account.
2. Run `/newbot` and choose a display name plus a username ending in `bot`.
3. Save the token somewhere private. Anybody holding it can control your Telegram bot.

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

OpenClaw can reload that configuration while the gateway is running. Pay attention to `dmPolicy: "pairing"`. A random person discovering the bot's username shouldn't automatically get to send instructions to the agent on your computer.

## 6. Pair your own account

Now message the bot from your own Telegram account. The gateway creates a pairing request instead of immediately trusting that sender. Check and approve it on the laptop:

```bash
openclaw pairing list telegram
openclaw pairing approve telegram <CODE>
```

The code expires after an hour, so don't save it for later. Once your account is approved, messages from your phone reach the agent and its replies appear in the same chat. This is the point where the setup starts feeling like an actual personal assistant.

## 7. Make the local model good enough

This is also the point where you discover whether your local model is actually capable of running an agent. A few things to watch:

- **Context eats space quickly.** System instructions, tool schemas and memory all use tokens. Ollama recommends a large window—at least 64k for some agent setups—and you can configure `OLLAMA_CONTEXT_LENGTH=65536` as shown in [my Ollama guide](/blog/ollama-local-llms/).
- **Your RAM still has to survive it.** I tried 32k on an 8 GB test box and got a killed runner plus an unhelpful `provider internal error, HTTP 500`. The real clue was in `journalctl -u ollama`. Lowering context or moving to a smaller model is often the practical fix.
- **Tool calling isn't the same as good judgement.** A tiny model may technically support tools while repeatedly choosing the wrong ones. Start small to verify the setup, then use the strongest model your hardware can run comfortably.
- **Keep loaded models around if you use the bot often.** `OLLAMA_KEEP_ALIVE=30m` avoids paying the model-loading penalty on every new conversation.

## 8. Day-to-day commands

| Command | Use |
| --- | --- |
| `openclaw status` | Check sessions, channels and overall health |
| `openclaw logs --follow` | Watch the agent's actual activity |
| `openclaw models list` | Confirm which model got selected |
| `openclaw doctor` | Diagnose configuration trouble |
| `openclaw gateway stop` | Shut the gateway down |
| `openclaw security audit` | Inspect permissions and exposed capabilities |

## Guardrails I'd keep

- Keep pairing on and allow only your own Telegram user ID. A bot that can touch your laptop should not respond to random strangers.
- Leave the gateway on loopback. I don't need to forward a public port to receive Telegram messages.
- After enabling new tools or skills, run `openclaw security audit` and make sure dangerous actions still need approval.
- Keep tokens out of repositories, screenshots and public config examples. The screenshots here don't expose mine.

Underneath the Telegram interface, this is still the same loop from my [AI agents guide](/blog/ai-agents-guide/). Giving it a chat app doesn't make it smarter or safer. The tool permissions and approvals are what matter.
