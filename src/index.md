---
permalink: "{{ '/classic/' if site.design == 'minimal' else '/' }}"
layout: base.njk
title: Home
---

# Welcome

You found the door. Most people walk past it.

My name is {{ github.name }}. I graduated in computer engineering in 2026 and live in {{ github.location }}. {{ github.bio | capitalize }}. I work as a data engineer at ICICI Lombard, building the pipelines that quietly move things from one place to another, and I am drawn to AI and machine learning, to systems that learn in the dark. I also build frontends and games, and sometimes design things in Figma, Blender, and After Effects late at night.

This is where I keep my work, and where I leave notes for whoever comes next. Sit down. The coffee is still warm. It has been warm for a very long time.

## Recent Transmissions

<ul class="post-list">
{%- for post in collections.post | reverse | limit(3) %}
  <li><time>{{ post.date | readableDate }}</time><a href="{{ post.url }}">{{ post.data.title }}</a>{% if loop.first %} <span class="new-badge">NEW!</span>{% endif %}</li>
{%- endfor %}
</ul>

## Recently Disturbed

<ul class="post-list">
{%- for repo in github.repos | limit(3) %}
  <li><time>{{ repo.pushed | readableDate }} · {{ repo.language or "unknown" }}</time><a href="{{ repo.url }}">{{ repo.name }}</a></li>
{%- endfor %}
</ul>

## Elsewhere

<a href="{{ github.url }}">GitHub</a> &nbsp;·&nbsp; <a href="{{ linkedin.url }}">LinkedIn</a> &nbsp;·&nbsp; <a href="mailto:kothariyashank@gmail.com">Write to me</a>
