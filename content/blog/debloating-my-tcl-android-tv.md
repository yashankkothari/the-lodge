---
title: "How I debloated my slow TCL Android TV (and what went wrong along the way)"
date: 2026-10-24
description: "How I used adb and tv-detox to make my TCL Android TV feel faster, plus the storage problems, cleanup mistake, and recovery steps I ran into."
tags: ["post", "essays", "android-tv", "tcl", "adb", "guides"]
---

My TCL TV had become painfully slow. It's an Android 11 set with only about 940 MB of RAM, and when I started, around 300 MB of that was free. Menus lagged, apps took ages to open, and the home screen was full of sponsored rows and ads.

I fixed most of it in one evening using an open-source project called [tv-detox](https://github.com/Ansub/tv-detox) and Claude Code to drive the whole process from my laptop. Here's what I did, what worked, and the mistakes worth knowing about before you try it.

> **Disclaimer:** This is what worked on my TV, not professional advice. Everything below changes system settings on your device. Use it at your own risk, and read the "undo" section before you start.

## The idea

Android TVs ship with a lot of apps you never asked for: manufacturer account apps, analytics services, ad feeds, demo-mode helpers, and Google's own sponsored home screen row. You can't uninstall most of them, but you *can* turn them off over `adb`, Android's debugging bridge. Turned-off apps stop using RAM and CPU, and they stay on the device, so everything is reversible.

tv-detox packages that approach: a planner script that classifies every installed app, a tiny replacement home screen, and an undo script.

## What you need

- A laptop on the same network as the TV
- `adb` installed (`android-platform-tools`)
- Developer mode on the TV: **Settings → Device Preferences → About**, press **Build** seven times, then enable **USB debugging** (or network debugging) in **Developer options**

## Step 1: Connect

I found the TV's IP address in its network settings and ran:

```sh
adb connect <TV_IP>:5555
```

The first connection showed as `unauthorized`. The TV pops up an "Allow USB debugging?" prompt that disappears after a short time. I had to reconnect and approve it quickly, ticking "Always allow".

## Step 2: Look before touching anything

tv-detox includes a read-only planner:

```sh
sh candidates.sh <TV_IP>
```

It labelled every app as one of:

- **never**: the TV needs it (System UI, Google Play services, Bluetooth, the HDMI input framework, TCL's settings store)
- **keep**: carries a feature you might use (casting, voice search, the phone remote)
- **safe**: common preinstalled junk
- **review**: unknown, so leave it alone unless you know it

On my TV that was 54 never, 10 keep, 22 safe and 55 to review.

## Step 3: Turn off the junk

I disabled all 22 "safe" apps. Nothing was uninstalled. Each package name was written to a log on the TV first, so the undo script knows what to switch back on. The list covered:

- **Google ads and extras:** the home-screen backdrop ads, the sponsored recommendations row, Google TV (Play Movies), Play Games, YouTube Music, and the feedback app
- **TCL bloat:** user centre, an ads feed service, analytics, message box and promos, built-in Alexa, store-demo sticker, phone-migration tool, key help, dashboard, launcher customizer, and the audio and picture players
- **Android extras:** the basic screensaver, an HTML viewer, the print spooler and the sound picker

The command for each one is simply:

```sh
adb shell pm disable-user --user 0 <package>
```

## Step 4: Replace the home screen

tv-detox ships a small replacement launcher: one screen with your apps, your HDMI inputs and a clock. It uses around 20-30 MB of RAM, which is a big saving compared to Google TV's launcher.

```sh
sh install.sh <TV_IP>
```

The installer also turns off Google's stock launcher so that pressing Home opens the new one. It has a safety net: if Home doesn't open the new launcher after the change, it automatically turns everything back on, so you can't end up with a TV that has no home screen.

## Hiccup #1: "not enough space"

The first install failed with `Requested internal only, but not enough space`. The TV had 3.4 GB of storage and only about 450 MB free. Android needs more headroom than the size of the app. Clearing the app caches (`pm trim-caches 2G`) freed enough to get it through.

This turned out to be the theme of the whole evening.

## Speed tweaks and a reboot test

After the home screen, I applied a few more settings:

- Window and transition animations set to 0
- The screensaver turned off
- A cap on background processes: `device_config put activity_manager max_cached_processes 4` (this survived a reboot)

Then I waited 30 seconds for Android to flush its settings to disk, rebooted, and confirmed the TV booted normally and Home still opened the new launcher. Don't skip the reboot test. It's the safest way to catch a bad change while you can still undo it.

## Finding what else was eating resources

I used `dumpsys meminfo` to see actual memory use instead of guessing. Most of the RAM was taken by things you shouldn't touch: the Android system, Google Play services and the Play Store. The one optional hog was Google's voice-search service (about 60 MB), which I disabled because I don't use voice search.

I also removed apps I'd sideloaded and no longer used, disabled TalkBack and Google Assistant, and deleted a leftover APK in the Downloads folder.

Free memory went from about 306 MB at the start to about 430 MB after the first reboot. Part of that gain is just from restarting a TV that had been on for a long time, so don't treat the number as pure savings.

## Hiccup #2: the Play Store silently failing

Later I tried to install Surfshark VPN from the Play Store. It "installed" and then did nothing. Crunchyroll also refused to update. Nothing showed on screen, so I looked at the logs:

```sh
adb logcat -d | grep -i "<app name>"
```

Both failures were `INSTALL_FAILED_INSUFFICIENT_STORAGE` (error 6005) again. With around 650 MB free, the Play Store would download the app but Android refused to install it.

I wanted to keep the two biggest apps I use (Stremio and Nuvio, about 270 MB and 190 MB), so I looked at where the space was going with `dumpsys diskstats`. The surprise was that the apps I'd disabled were still holding on to their data, cache and downloaded updates. The stock Google TV launcher alone held about 140 MB while turned off.

I cleared them with `pm clear` and reverted their updates with `pm uninstall-system-updates`. That freed about 190 MB.

## Hiccup #3: a cleanup command that undid my work

This one is worth highlighting. `pm uninstall-system-updates` **re-enabled** most of the apps I'd disabled, including Google's stock launcher, and Home went back to opening it. I had to disable them all again and re-set my launcher as the default.

If you try this: run the cleanup, then check `pm list packages -d` and which app currently handles Home, and fix anything that changed.

## A lighter VPN: WireGuard instead of the Surfshark app

The Surfshark app was too big for the storage I had. But Surfshark supports plain WireGuard, and the WireGuard app is only a few MB.

1. On the laptop: Surfshark account → VPN → Manual setup → Android → WireGuard. Generate a key pair and download a `.conf` file per country.
2. Install **WireGuard** from the Play Store on the TV.
3. Push the config files over adb: `adb push us-sfo.conf /sdcard/Download/`
4. In the WireGuard app: **+ → Import from file or archive**, then pick the file. A zip of several configs imports them all in one go.

You lose Surfshark's server list, kill switch and extras, but you get a working VPN in a few megabytes. **Treat these config files as passwords.** They contain your private key, so delete them from the TV's Download folder after importing.

## Keeping the TV awake

I also wanted the TV never to sleep or start the screensaver:

```sh
adb shell settings put secure sleep_timeout 0
adb shell settings put system screen_off_timeout 2147483647
adb shell settings put secure screensaver_enabled 0
```

Manufacturers often add their own auto power-off option inside their own settings menu, so check there too. Leaving a TV on all the time is fine on an LCD, but a static image can burn into an OLED.

## Undoing everything

I saved the undo script and a plain-text list of every change (disabled apps, changed settings, their old values) in my Documents folder. Undoing the home screen and re-enabling every app on the log is one command:

```sh
sh undo.sh <TV_IP>
```

If the TV ever gets stuck restarting, the project's README documents how to reconnect during the first seconds of boot and re-enable everything:

```sh
for p in $(adb shell pm list packages -d | tr -d '\r' | sed 's/package://'); do adb shell pm enable "$p"; done
```

## What I'd tell you before you start

1. **Look at free storage first.** Under about 15% free, installs and updates quietly fail. Free space before you start, not after.
2. **Disable, don't uninstall,** wherever you can. It's the difference between a mistake and a disaster.
3. **Keep a written list** of every change and its old value. I kept one in a text file the whole time.
4. **Reboot and test** after the big changes.
5. **Check the logs** when something silently doesn't work. `adb logcat` told me exactly what was wrong in seconds.
6. **Don't touch Google Play services' data.** It's the biggest app on the TV (700 MB), but clearing it can sign you out and break things.

## Result

The TV is noticeably snappier. The home screen is clean, with no ads, sponsored rows or manufacturer promos. Animations are instant, around 125 MB more RAM is free after a fresh boot, and the disk went from 88% full to 76% full. Most of that came from about an hour of careful, reversible changes.

Thanks to [Ansub Khan](https://github.com/Ansub/tv-detox) for the tv-detox project that made this safe and simple to try.
