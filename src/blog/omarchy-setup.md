---
title: "Setting Up Omarchy: My Arch + Hyprland Dev Laptop"
date: 2026-10-08
tags: ["post", "linux", "omarchy", "guides"]
---

I run Omarchy on my laptop. It's DHH's very opinionated Arch Linux setup with Hyprland, a terminal, Neovim and a bunch of shortcuts already chosen for you. Some people hate that kind of setup. I actually like having someone make those decisions so I can get on with using the machine.

It's also where my local AI stuff lives: [Ollama](/blog/ollama-local-llms/) and [OpenClaw over Telegram](/blog/openclaw-telegram-ollama/). If I were reinstalling the laptop tomorrow, this is the order I'd follow.

<figure><img src="/img/blog/diagram-omarchy-stack.png" alt="The Omarchy stack: Arch Linux, Hyprland, apps" loading="lazy"><figcaption>What you actually get: Arch underneath, Hyprland on top, and a curated set of apps.</figcaption></figure>

## Before you start

- **Use a dedicated drive.** The installer wipes the disk you pick and sets up full-disk encryption. Dual-booting on one drive needs the manual install route.
- **Turn off Secure Boot (and TPM if your BIOS ties them together).** The installer won't boot otherwise.
- **Have a wired or 2.4 GHz keyboard.** You type the disk password before Bluetooth exists, so a Bluetooth-only keyboard can't unlock the machine.
- **Back up anything on that drive.** Seriously. The installer is not asking whether you meant to keep your files.

## 1. Flash the ISO and install

Download the ISO from [omarchy.org](https://omarchy.org/), write it to a USB stick (balenaEtcher on Windows/Mac, `caligula` on Linux), and boot from it.

The installer asks a handful of questions: keyboard layout, username, password, hostname, timezone. Confirm them, pick the drive, and wait 2 to 10 minutes.

<figure><img src="/img/blog/omarchy-installer.png" alt="Omarchy installer confirmation screen" loading="lazy"><figcaption>The installer's confirmation step. Screenshot: The Omarchy Manual.</figcaption></figure>

<figure><img src="/img/blog/omarchy-installed.png" alt="Omarchy installation complete screen" loading="lazy"><figcaption>Done. Reboot, type your disk password, and you're in. Screenshot: The Omarchy Manual.</figcaption></figure>

## 2. Learn these shortcuts on day one

Everything in Omarchy is a keystroke. You don't need all of them; you need these, and `Super + K` shows the rest whenever you forget.

<figure><img src="/img/blog/diagram-omarchy-hotkeys.png" alt="Omarchy hotkey cheat sheet" loading="lazy"><figcaption>My cheat sheet. Rebind anything in <code>~/.config/hypr/bindings.conf</code>.</figcaption></figure>

The two that change how you work: `Super + Alt + Space` opens the Omarchy menu (install apps, change themes, update), and `Super + 1–4` jumps between workspaces. I keep the editor on 1, browser on 2, terminals on 3 and chat on 4.

## 3. Update the Omarchy way

Don't reach for `pacman -Syu` out of habit. Use **Update > Omarchy** in the menu (or `omarchy update` in a terminal). It pulls new configs and runs migrations together with the package upgrade, so a new library version doesn't arrive without the config change it needs.

Every update takes a Btrfs snapshot first. If something breaks, reboot, pick the pre-update snapshot in the Limine boot menu, and restore.

<figure><img src="/img/blog/omarchy-limine-snapshots.png" alt="Limine boot menu listing Omarchy snapshots" loading="lazy"><figcaption>Rolling back a bad update is a reboot away. Screenshot: The Omarchy Manual.</figcaption></figure>

One catch: snapshots restore the system, not `/home`. They won't bring back a deleted file, so keep real backups too. You can take one by hand before a risky change:

```bash
omarchy-snapshot create
```

## 4. Set up the dev tools

Omarchy already ships Neovim (LazyVim), Docker, `mise` for language runtimes, and AI coding CLIs (`c` opens OpenCode, `cx` opens Claude Code). What I add on top:

```bash
# Language runtimes through mise
mise use -g node@24 python@3.12

# Git identity
git config --global user.name "Yashank Kothari"
git config --global user.email "you@example.com"

# Anything else from the Arch repos or the AUR
yay -S --needed ollama
```

Run `omarchy` with no arguments at least once. You'll find the helpers behind the menu: themes, fonts, screenshots and debug commands. Knowing they exist also makes it easier to get an agent to change your setup without randomly rewriting config files.

## 5. Make it yours, safely

- Configs live in `~/.config` (Hyprland, Waybar, terminal, Neovim). Edit there, not in the Omarchy source.
- Try themes with `Super + Ctrl + Shift + Space` before you start editing colours by hand.
- If you wreck your configs, `omarchy reinstall` resets them to the current release. It overwrites your changes, so commit `~/.config` to a dotfiles repo first.

## What I'd tell myself before installing

1. Give tiling a proper week. The first couple of days are annoying because your muscle memory is wrong. Then going back to dragging windows around starts feeling silly.
2. Learn `Super + K`. It answers most questions.
3. Update through the menu, and know how the snapshots work before you need them.
4. Put local AI on it. Next up: [running models with Ollama](/blog/ollama-local-llms/).
