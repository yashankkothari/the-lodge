---
title: OncoLytix
order: 3
year: 2025
tech: [MobileNetV2, MediaPipe Model Maker, React Native, Expo, Flask]
summary: A phone app that reads lung CT scans and returns a prediction in seconds.
source: https://github.com/yashankkothari/Lung-Cancer-Detection-Using-ML
live: ""
stats:
  - { value: "87%", label: "classification accuracy" }
  - { value: "iOS + Android", label: "one codebase" }
---

## The Problem

Reading CT scans takes trained specialists and time. I wanted to see how far a lightweight model on a mobile-friendly stack could go as a first-pass screening aid. It was built as a learning project, not a diagnostic tool.

## What I Built

- **Model:** a MobileNetV2-based image classifier trained with MediaPipe Model Maker on lung CT images. MobileNetV2 is small enough to serve quickly without a heavy GPU.
- **API:** a Flask REST service that handles image preprocessing, queues requests, and returns predictions in real time.
- **App:** a cross-platform React Native (Expo) front end where a user uploads a scan and sees the result clearly.

## Results

The classifier reached 87% accuracy on held-out CT scans, and the full loop runs end to end: upload, preprocessing, prediction, display.

## Screenshots

<!-- ![OncoLytix upload screen](/img/projects/oncolytix-upload.png) -->
<p class="faint-note">Screenshots pending.</p>
