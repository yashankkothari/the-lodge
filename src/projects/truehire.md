---
title: TrueHire
order: 6
year: 2025
tech: [Google Gemini, Prompt Engineering, Electron, Lit]
thumb: /img/projects/truehire-home.jpg
summary: An LLM desktop app that checks a candidate's résumé against their GitHub and scores how credible it is.
source: https://github.com/yashankkothari/TruHire
live: ""
stats:
  - { value: "3", label: "sources cross-checked" }
  - { value: "Streaming", label: "results in real time" }
---

## The Problem

Recruiters see inflated résumés, borrowed projects and timelines that don't line up, and real background checks are slow and expensive. We wanted a first pass that takes seconds.

## What I Built

Built with a teammate for a hackathon.

- **Inputs:** a résumé (PDF, DOC, DOCX or TXT), a LinkedIn export and a GitHub username.
- **AI pipeline:** files are parsed and normalised, then sent to Google Gemini with prompts that ask it to check every claim against public GitHub activity.
- **Output:** a structured credibility score with its reasoning, plus red flags such as suspicious projects, unsupported claims and timeline gaps.
- **App:** an Electron desktop UI (Lit components) that streams Gemini's analysis to the recruiter as it arrives, over Electron IPC.

## What I Learned

Most of the work was prompt design: getting the model to cite the evidence for each claim and return a fixed structure the UI can render, instead of a confident paragraph.

## Screenshots

<figure class="shot">
  <img src="/img/projects/truehire-home.jpg" alt="TrueHire: résumé, LinkedIn and GitHub in, Gemini credibility score out" loading="lazy">
  <figcaption>Résumé, LinkedIn and GitHub in; a Gemini credibility score out.</figcaption>
</figure>
