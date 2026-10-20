---
layout: base.njk
title: Now
description: "Yashank Kothari’s current projects, coding agents, local ML setup, books, music, and games. Updated October 2026."
permalink: /now/
updated: 2026-10-20
---

# Now

Lately: data pipelines at work, Savory and Pixonomy after work, and a lot of time with coding agents.

<p class="post-date">Last updated {{ updated | readableDate }} · Mumbai</p>

## At work

I’m a data engineer at ICICI Lombard in Mumbai. Most of my work is in Oracle: ETL pipelines, PL/SQL workflows, reporting data, and reconciliation.

<span id="building"></span>

## What I’m building

- **[Savory](https://getsavory.xyz)** — a searchable library for X bookmarks, with folders, tags, notes, and on-device semantic search.
- **[Pixonomy](https://playpixopoly.com)** — a pixel-art property game in Godot for 2–6 players. Online, over a LAN, or on one PC.
- **phonetocam** — turning an Android phone into a low-latency webcam for Windows, in Rust.
- **This website** — getting the projects and writing into a shape I actually like.

The longer write-ups and screenshots are on the [projects page](/portfolio/).

## What I’m coding with

Claude Code CLI and Codex are my main coding agents right now, mostly with Claude Opus 5.5 and GPT 6.1 Sol. I’m also using OpenClaw and Hermes Agent.

Locally, I run Qwen3 through Ollama on my Omarchy laptop, with Telegram as an interface for OpenClaw. I’ve written up the [Ollama setup](/blog/ollama-local-llms/) and [OpenClaw setup](/blog/openclaw-telegram-ollama/), including the parts that needed fixing along the way.

The rest of my ML tools, hardware, and software are on the [Uses page](/uses/).

<span id="reading"></span>

## Reading

<div class="shelf shelf-books">
  <figure><img src="/img/now/ddia.jpg" alt="Designing Data-Intensive Applications cover" loading="lazy" width="300"><figcaption><span>Designing Data-Intensive Applications</span><span class="dim">Martin Kleppmann</span></figcaption></figure>
  <figure><img src="/img/now/industrial-society.jpg" alt="Industrial Society and Its Future cover" loading="lazy" width="300"><figcaption><span>Industrial Society and Its Future</span><span class="dim">Theodore Kaczynski</span></figcaption></figure>
  <figure><img src="/img/now/sun-and-steel.jpg" alt="Sun and Steel cover" loading="lazy" width="300"><figcaption><span>Sun and Steel</span><span class="dim">Yukio Mishima</span></figcaption></figure>
</div>

## Listening

Michael Jackson, The Strokes, EsDeeKid, and Daft Punk have been in the rotation.

<div class="shelf shelf-albums">
  <figure><img src="/img/now/bad.jpg" alt="Bad album art" loading="lazy" width="300"><figcaption><span>Bad</span><span class="dim">Michael Jackson</span></figcaption></figure>
  <figure><img src="/img/now/reality-awaits.jpg" alt="Reality Awaits album art" loading="lazy" width="300"><figcaption><span>Reality Awaits</span><span class="dim">The Strokes</span></figcaption></figure>
  <figure><img src="/img/now/rebel.jpg" alt="Rebel album art" loading="lazy" width="300"><figcaption><span>Rebel</span><span class="dim">EsDeeKid</span></figcaption></figure>
  <figure><img src="/img/now/discovery.jpg" alt="Discovery album art" loading="lazy" width="300"><figcaption><span>Discovery</span><span class="dim">Daft Punk</span></figcaption></figure>
</div>

## Playing

CS2 on weekends, with Monster Hunter Rise, Balatro, and Black Flag in the rotation.

<div class="shelf shelf-games">
  <figure><img src="/img/now/cs2.jpg" alt="Counter-Strike 2" loading="lazy" width="300"><figcaption><span>Counter-Strike 2</span><span class="dim">Valve</span></figcaption></figure>
  <figure><img src="/img/now/mh-rise.jpg" alt="Monster Hunter Rise" loading="lazy" width="300"><figcaption><span>Monster Hunter Rise</span><span class="dim">Capcom</span></figcaption></figure>
  <figure><img src="/img/now/balatro.jpg" alt="Balatro" loading="lazy" width="300"><figcaption><span>Balatro</span><span class="dim">LocalThunk</span></figcaption></figure>
  <figure><img src="/img/now/black-flag.jpg" alt="Assassin's Creed Black Flag Resynced" loading="lazy" width="300"><figcaption><span>Black Flag Resynced</span><span class="dim">Ubisoft</span></figcaption></figure>
</div>

<p class="faint-note">This is a <a href="https://nownownow.com/about">/now page</a>.</p>

<details class="pixel-corner">
  <summary>The pixel owl and a few chiptunes</summary>
  <div class="tape">
    <canvas id="owl" width="96" height="96" role="img" aria-label="A small pixel owl"></canvas>
    <div class="deck">
      <p class="now"><span class="dim">Original browser-made chiptunes</span><br><b id="track">night shift</b></p>
      <div class="bar"><i id="fill"></i></div>
      <div class="ctl"><button type="button" data-a="prev">prev</button><button type="button" data-a="play" id="play">play</button><button type="button" data-a="next">skip</button><span class="dim" id="time">0:00</span></div>
    </div>
  </div>
</details>
