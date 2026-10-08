---
layout: base.njk
title: The Work
permalink: "{{ '/classic/portfolio/' if site.design == 'minimal' else '/portfolio/' }}"
---

# The Work

Where I have been, and what I left behind there.

## The Record

{%- for job in linkedin.experience %}
<section class="job">
  <p class="job-period">{{ job.period }} · {{ job.location }}</p>
  <h3>{{ job.role }}</h3>
  <p class="job-org">{{ job.org }}</p>
  <ul>
  {%- for pt in job.points %}
    <li>{{ pt }}</li>
  {%- endfor %}
  </ul>
</section>
{%- endfor %}

## Education

{%- for ed in linkedin.education %}
<section class="job">
  <p class="job-period">{{ ed.period }}</p>
  <h3>{{ ed.degree }}</h3>
  <p class="job-org">{{ ed.school }}</p>
</section>
{%- endfor %}

<p class="faint-note">Full record on <a href="{{ linkedin.url }}">LinkedIn</a>.</p>

## Certifications

<div class="table-wrap">
<table>
  <tbody>
{%- for c in linkedin.certifications %}
    <tr><td>{{ c.year }}</td><td>{{ c.name }}</td><td class="faint">{{ c.issuer }}</td></tr>
{%- endfor %}
  </tbody>
</table>
</div>

## Instruments

<div class="table-wrap">
<table>
  <tbody>
{%- for s in linkedin.skills %}
    <tr><th scope="row">{{ s.group }}</th><td>{{ s.items }}</td></tr>
{%- endfor %}
  </tbody>
</table>
</div>

<h2 id="projects">Projects</h2>

Case files. Some of them are still running when no one is watching.

<div class="table-wrap">
<table>
  <thead>
    <tr><th>Year</th><th>Project</th><th>Built With</th><th>What It Is</th></tr>
  </thead>
  <tbody>
{%- for p in collections.project | sort(false, false, "data.order") %}
    <tr>
      <td>{{ p.data.year }}</td>
      <td><a href="{{ p.url }}">{{ p.data.title }}</a></td>
      <td>{{ p.data.tech | join(", ") }}</td>
      <td>{{ p.data.summary }}</td>
    </tr>
{%- endfor %}
  </tbody>
</table>
</div>

<p class="faint-note">More on <a href="{{ github.url }}">GitHub</a>. Or read the whole <a href="/resume/">résumé</a>.</p>
