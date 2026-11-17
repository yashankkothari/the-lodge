---
title: "How I debloated my slow TCL Android TV (and what went wrong along the way)"
date: 2026-10-24
description: "How I used adb and tv-detox to make my TCL Android TV feel faster, plus the storage problems, cleanup mistake, and recovery steps I ran into."
tags: ["post", "essays", "android-tv", "tcl", "adb", "guides"]
---

My TCL TV had reached the point where opening an app felt like asking it a personal favour. It's running Android 11 with roughly 940 MB of RAM. When I checked, only about 300 MB was free. The menus lagged, apps crawled, and the home screen still somehow had enough resources to show me ads.

I spent an evening fixing it with [tv-detox](https://github.com/Ansub/tv-detox) and Claude Code helping me run through the steps from my laptop. It worked, but I also ran into storage errors, broke my launcher setup once and had to undo part of my own cleanup. So I'm writing down the whole thing, including the stupid parts.

> **Before you try this:** These are the steps that worked on *my* TV. You're changing system settings, and different models can behave differently. Read the undo section first. Seriously.

## The idea

It's ridiculous how much junk comes preinstalled on a TV. Manufacturer accounts, telemetry, ads, demo-mode tools, Google's sponsored recommendations. Most of it can't be removed from Settings. But `adb` lets you disable Android packages, which is all I really needed. I wanted the bloat to stop running, not to start deleting system components and pray the TV still booted.

That's basically what tv-detox helps you do. It has a script to sort through installed packages, a lightweight launcher, and an undo script for when you mess something up.

## What you need

- A laptop connected to the same network as your TV.
- `adb` installed. It's part of `android-platform-tools`.
- Developer mode enabled on the TV. Go to **Settings → Device Preferences → About**, press **Build** seven times, then turn on **USB debugging** (or network debugging) under **Developer options**.

## Step 1: Connect

Grab the TV's IP from its network settings. Then connect:

```sh
adb connect <TV_IP>:5555
```

Mine came back as `unauthorized` the first time. There's an "Allow USB debugging?" popup on the TV, except it doesn't stick around for long. I reconnected, caught the popup and ticked "Always allow".

## Step 2: Look before touching anything

Before disabling random packages, run tv-detox's read-only planner:

```sh
sh candidates.sh <TV_IP>
```

It sorts the installed packages into four groups:

- **never**: don't touch these. System UI, Play services, Bluetooth, HDMI input handling and TCL's settings store belong here.
- **keep**: things you may actually want, like casting, voice search and the phone remote.
- **safe**: the usual preinstalled bloat.
- **review**: packages the script can't confidently classify. Leave these alone unless you've checked them yourself.

My TV had 54 in never, 10 in keep, 22 in safe and 55 in review. That's a lot of packages for a device with less than a gigabyte of RAM.

## Step 3: Turn off the junk

I disabled all 22 "safe" packages. No uninstalling. The script logs each package name on the TV before disabling it, which means the undo script has a record of what to restore. Here's the kind of stuff that got switched off:

- **Google's extras:** backdrop ads, sponsored recommendations, Google TV (Play Movies), Play Games, YouTube Music and the feedback app.
- **TCL's own junk:** user centre, ad feeds, analytics, promos, the built-in Alexa integration, store-demo sticker, phone migration, key help, dashboard, launcher customization and the bundled audio and picture players.
- **Other Android extras:** screensaver, HTML viewer, print spooler and sound picker.

Under the hood, disabling one package is just:

```sh
adb shell pm disable-user --user 0 <package>
```

## Step 4: Replace the home screen

The replacement launcher is refreshingly boring. Your apps, HDMI inputs and a clock. That's it. tv-detox's launcher uses around 20–30 MB of RAM, a lot less than the Google TV home screen I was trying to get rid of.

```sh
sh install.sh <TV_IP>
```

The installer disables Google's launcher so the Home button opens the replacement. It also checks that Home still works. If the replacement doesn't open, the installer rolls the change back. Important, because a TV with no functioning home screen is a terrible way to spend your evening.

## Hiccup #1: "not enough space"

The first install failed with `Requested internal only, but not enough space`. The TV had 3.4 GB of storage and only about 450 MB free. Android needs more headroom than the size of the app. Clearing the app caches (`pm trim-caches 2G`) freed enough to get it through.

I thought I'd fixed the storage problem. I had not. It came back repeatedly.

## Speed tweaks and a reboot test

Once the launcher was working, I changed a few more things:

- Set window and transition animations to 0.
- Turned off the screensaver.
- Limited cached background processes with `device_config put activity_manager max_cached_processes 4`. This setting survived a reboot.

I gave Android 30 seconds to write the settings to disk, then rebooted. The TV came back normally and Home still opened the new launcher. Do this test. A nice-looking home screen means nothing if it breaks the next time you switch the TV on.

## Finding what else was eating resources

I checked `dumpsys meminfo` to see where the RAM was actually going. Most of it was tied up in things I wasn't going to touch: Android itself, Google Play services and the Play Store. Google's voice-search service stood out at about 60 MB. I never use voice search, so that one went.

I got rid of some old sideloaded apps, disabled TalkBack and Google Assistant, and deleted an APK I'd left sitting in Downloads.

Free RAM went from roughly 306 MB to 430 MB after that first reboot. I'm not going to pretend all 124 MB came from debloating. Restarting a TV that's been running for ages helps too.

## Hiccup #2: the Play Store silently failing

Then I tried installing Surfshark VPN. The Play Store acted like it had installed it, but nothing happened. Crunchyroll wouldn't update either. No useful error message on the TV, of course. So I checked the logs:

```sh
adb logcat -d | grep -i "<app name>"
```

Both failures came down to `INSTALL_FAILED_INSUFFICIENT_STORAGE` (error 6005). Again. Apparently 650 MB of free space still wasn't enough. The Play Store could download an app and Android would refuse to install it.

I wasn't about to delete Stremio or Nuvio, which were using about 270 MB and 190 MB respectively. Instead I checked `dumpsys diskstats`. Turns out disabling an app doesn't make its data, cache or downloaded updates disappear. The Google TV launcher alone was sitting on roughly 140 MB while disabled. Incredible.

I used `pm clear` to clear the data and `pm uninstall-system-updates` to roll back updates. That got me about 190 MB back, although the second command caused another problem.

## Hiccup #3: a cleanup command that undid my work

Here's where I undid my own work. `pm uninstall-system-updates` **re-enabled** most of the apps I'd just disabled, including Google's stock launcher. Suddenly Home was opening the old ad-filled screen again. I had to go back through the packages and set my replacement launcher as the default. Not my proudest moment.

If you do the same cleanup, check `pm list packages -d` afterwards. Also check which launcher handles Home. Don't assume your disabled apps stayed disabled just because you didn't explicitly re-enable them.

## A lighter VPN: WireGuard instead of the Surfshark app

At that point I was done trying to squeeze the full Surfshark app onto the TV. Surfshark supports standard WireGuard configs, and the WireGuard app takes up only a few megabytes.

1. On your laptop, open Surfshark account → VPN → Manual setup → Android → WireGuard. Generate a key pair, then download a `.conf` for each country you want.
2. Install **WireGuard** on the TV from the Play Store.
3. Copy the config across with adb: `adb push us-sfo.conf /sdcard/Download/`
4. Open WireGuard, tap **+ → Import from file or archive**, and select the config. You can also import a zip containing multiple configs.

You don't get Surfshark's nice server picker, kill switch or other extras. But you get a VPN that actually fits on the TV. One thing I wouldn't be casual about: **those `.conf` files contain your private key**. Treat them like passwords and delete them from Downloads after importing.

## Keeping the TV awake

I wanted to stop the TV from going to sleep or launching a screensaver, so I set:

```sh
adb shell settings put secure sleep_timeout 0
adb shell settings put system screen_off_timeout 2147483647
adb shell settings put secure screensaver_enabled 0
```

TCL and other manufacturers can have their own auto power-off setting buried in a separate menu, so check that as well. And don't blindly copy the always-on setup if you have an OLED. Static images and burn-in are a real concern there.

## Undoing everything

I kept the undo script and a plain-text record of everything I'd changed in Documents: disabled packages, settings, previous values. If I needed to restore the original launcher and re-enable the logged packages, I could run:

```sh
sh undo.sh <TV_IP>
```

The project's README also explains how to reconnect during the first few seconds of boot if the TV gets stuck restarting. This loop re-enables disabled packages:

```sh
for p in $(adb shell pm list packages -d | tr -d '\r' | sed 's/package://'); do adb shell pm enable "$p"; done
```

## What I'd tell you before you start

1. **Check storage before doing anything.** Below roughly 15% free, my installs and updates started failing without much explanation. Make room first.
2. **Disable packages instead of uninstalling them** when you have the option. You want a way back.
3. **Write down every change and its previous value.** The text file I kept saved me from guessing later.
4. **Reboot after major changes.** If it only works until the next restart, it doesn't work.
5. **Read the logs.** `adb logcat` exposed the storage problem when the Play Store wouldn't tell me anything.
6. **Leave Google Play services' data alone.** It's huge on my TV, around 700 MB, but clearing it can sign you out and break other things.

## Result

The TV finally feels usable. Home opens when I press Home. No sponsored rows, no TCL promos, no waiting around for a menu to appear. After a fresh boot I had around 125 MB more free RAM, and storage usage went from 88% to 76%. The reboot deserves some credit for the RAM number, sure. But I can actually feel the difference when using the TV, which matters a lot more than a screenshot of `meminfo`.

Credit to [Ansub Khan](https://github.com/Ansub/tv-detox) for tv-detox. I wouldn't have wanted to figure out all of those packages and recovery steps from scratch.
