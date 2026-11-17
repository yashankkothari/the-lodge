---
title: "Setting Up Omarchy: My Arch + Hyprland Dev Laptop"
date: 2026-10-08
tags: ["post", "linux", "omarchy", "guides"]
---

I run Omarchy on my laptop. It's DHH's very opinionated Arch Linux setup with Hyprland, a terminal, Neovim and a bunch of shortcuts already chosen for you. Some people hate that kind of setup. I actually like having someone make those decisions so I can get on with using the machine.

It's also where my local AI stuff lives: [Ollama](/blog/ollama-local-llms/) and [OpenClaw over Telegram](/blog/openclaw-telegram-ollama/). If I were reinstalling the laptop tomorrow, this is the order I'd follow.

<figure><img src="/img/blog/diagram-omarchy-stack.png" alt="The Omarchy stack: Arch Linux, Hyprland, apps" loading="lazy"><figcaption>What you actually get: Arch underneath, Hyprland on top, and a curated set of apps.</figcaption></figure>

## Before you start

- **Give it its own drive if you can.** The installer erases the selected disk and sets up encryption. If you want to dual-boot on one disk, you're looking at a more manual process.
- **Check Secure Boot before trying to boot the installer.** You may need to disable it, and some BIOS configurations tie the relevant settings to TPM.
- **Don't rely on a Bluetooth-only keyboard at boot.** The disk unlock prompt happens before your Bluetooth devices are paired. Keep something wired or using a 2.4 GHz dongle available.
- **Back up anything on that drive.** Seriously. The installer is not asking whether you meant to keep your files.

## 1. Flash the ISO and install

Get the ISO from [omarchy.org](https://omarchy.org/). Flash it to USB using balenaEtcher on Windows or macOS, or `caligula` on Linux, then boot the laptop from that USB. Double-check which disk you're about to select before continuing.

The setup asks for things like keyboard layout, username, password, hostname and timezone. After that you choose the target drive and let it run. On a normal setup, the installation itself should take only a few minutes, but I'd rather wait than rush through the destructive confirmation screen.

<figure><img src="/img/blog/omarchy-installer.png" alt="Omarchy installer confirmation screen" loading="lazy"><figcaption>The installer's confirmation step. Screenshot: The Omarchy Manual.</figcaption></figure>

<figure><img src="/img/blog/omarchy-installed.png" alt="Omarchy installation complete screen" loading="lazy"><figcaption>Done. Reboot, type your disk password, and you're in. Screenshot: The Omarchy Manual.</figcaption></figure>

## 2. Learn these shortcuts on day one

The shortcuts are the bit that initially makes a tiling setup feel hostile. You don't need to memorise the entire cheat sheet on day one. Start with the few below, and use `Super + K` whenever you forget what something does.

<figure><img src="/img/blog/diagram-omarchy-hotkeys.png" alt="Omarchy hotkey cheat sheet" loading="lazy"><figcaption>My cheat sheet. Rebind anything in <code>~/.config/hypr/bindings.conf</code>.</figcaption></figure>

The two I rely on constantly are `Super + Alt + Space` for the Omarchy menu and `Super + 1–4` for switching workspaces. My usual layout is editor on 1, browser on 2, terminal on 3 and chat on 4. It sounds fussy when you describe it; in practice it saves me a ridiculous amount of window juggling.

## 3. Update the Omarchy way

Coming from plain Arch, the instinct is to run `pacman -Syu`. Omarchy has its own update flow for a reason. Use **Update > Omarchy** or `omarchy update` so the package upgrades arrive alongside the project's configuration changes and migrations. You don't want half of an update.

One thing I appreciate is the Btrfs snapshot before updates. If a new configuration breaks the system, you can boot into a pre-update snapshot from Limine and recover instead of spending your evening reconstructing the previous setup.

<figure><img src="/img/blog/omarchy-limine-snapshots.png" alt="Limine boot menu listing Omarchy snapshots" loading="lazy"><figcaption>Rolling back a bad update is a reboot away. Screenshot: The Omarchy Manual.</figcaption></figure>

But don't confuse snapshots with backups. They cover the system state, not everything in `/home`. Accidentally delete your notes and a system rollback won't magically put them back. Before a risky experiment you can also create a snapshot yourself:

```bash
omarchy-snapshot create
```

## 4. Set up the dev tools

The default install already includes a lot of what I would otherwise spend an afternoon setting up: Neovim with LazyVim, Docker, `mise`, and shortcuts for coding assistants (`c` for OpenCode and `cx` for Claude Code). I mostly add my preferred runtimes and local model setup:

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

- Most of your customisation belongs in `~/.config`: Hyprland, Waybar, terminal and editor settings. Don't start modifying Omarchy's own source just to change a keybinding.
- Cycle themes with `Super + Ctrl + Shift + Space` before spending hours hand-editing a colour scheme.
- `omarchy reinstall` can reset configs if you've really broken them, but it overwrites your changes. Keep those files in a dotfiles repo before getting experimental.

## What I'd tell myself before installing

1. Give tiling a proper week. The first couple of days are annoying because your muscle memory is wrong. Then going back to dragging windows around starts feeling silly.
2. Keep `Super + K` in muscle memory. It's much easier than searching for a shortcut every ten minutes.
3. Update through the menu, and know how the snapshots work before you need them.
4. Once the machine feels comfortable, try [Ollama](/blog/ollama-local-llms/). Having local models available alongside the rest of my development setup is one of the reasons I enjoy this laptop.
