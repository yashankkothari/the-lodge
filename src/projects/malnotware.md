---
title: MalNotWare
order: 4
year: 2025
tech: [Docker, VirusTotal API, Browser Extension, JavaScript]
thumb: /img/projects/malnotware-home.jpg
summary: A browser extension that watches what you download, then watches what it does.
source: https://github.com/yashankkothari/Malnotware-Malware-Detection-with-AI-ML
live: ""
stats:
  - { value: "2", label: "layers of analysis" }
  - { value: "Real-time", label: "behavior monitoring" }
---

## The Problem

Most people download a file and open it without a second thought. Signature-based antivirus catches known threats, but new or modified malware can slip past a hash lookup.

## What I Built

MalNotWare combines two kinds of analysis and starts them automatically when a file is downloaded.

- **Static analysis:** a custom browser extension catches the download and checks it against the **VirusTotal API** for known threats.
- **Dynamic analysis:** suspicious files are executed inside an isolated **Docker** sandbox, where their behavior is monitored in real time.
- **Containment:** the container isolates the file from the host, so running something dangerous only risks a disposable container.

## Results

The result is a working hybrid detector. It flags known malware immediately and gives unknown files a second look based on what they actually do, not just what they look like.

## Screenshots

<figure class="shot">
  <img src="/img/projects/malnotware-home.jpg" alt="MalNotWare landing page: Detect Threats with Hybrid AI" loading="lazy">
  <figcaption>The landing page, built for GajShield Hack 8.</figcaption>
</figure>

<figure class="shot">
  <img src="/img/projects/malnotware-scan.jpg" alt="MalNotWare scan page with a drag and drop upload box" loading="lazy">
  <figcaption>The scan page: drop a file in and the hybrid model checks it without running it.</figcaption>
</figure>

