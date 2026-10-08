---
title: "REST API Design Basics I Wish I'd Learned Earlier"
date: 2024-11-23
tags: ["post", "backend", "guides"]
---

Most APIs I've written for college projects worked. Few of them were pleasant to use. The difference is a handful of conventions that cost nothing to follow once you know them, and a lot to retrofit once a frontend depends on your mistakes.

This is the checklist I now run through before writing a single route.

## Model resources, not actions

A REST API is organised around **resources**: nouns your clients care about. The HTTP method carries the verb.

```http
GET    /notes            list notes
POST   /notes            create a note
GET    /notes/42         fetch one note
PATCH  /notes/42         update part of it
DELETE /notes/42         delete it
GET    /notes/42/comments  comments belonging to note 42
```

Avoid `/getNotes`, `/createNote`, `/deleteNoteById`. They duplicate what the method already says and make the surface area grow with every feature.

Some operations genuinely aren't CRUD, like "publish this note" or "send a password reset". It's fine to model those as a sub-resource or an action endpoint (`POST /notes/42/publish`). Just keep them the exception.

Use plural nouns, lowercase, and hyphens in paths. Keep nesting shallow; past two levels, a filter usually reads better (`/comments?note_id=42`).

## Use status codes properly

Status codes let clients handle results without parsing your message strings. The ones you'll use most:

| Code | Meaning |
|------|---------|
| `200 OK` | Success with a body |
| `201 Created` | Resource created; include a `Location` header |
| `204 No Content` | Success, nothing to return (common for DELETE) |
| `400 Bad Request` | Malformed request or invalid input |
| `401 Unauthorized` | Not authenticated |
| `403 Forbidden` | Authenticated, but not allowed |
| `404 Not Found` | Resource doesn't exist (or you won't admit it does) |
| `409 Conflict` | State conflict, e.g. duplicate or version mismatch |
| `422 Unprocessable Content` | Well-formed but fails validation (some APIs use 400 for this) |
| `429 Too Many Requests` | Rate limited; send `Retry-After` |
| `500 Internal Server Error` | Your bug, not theirs |

The one rule I'd enforce above all: **never return `200` with `"success": false` in the body.** It breaks every HTTP client, proxy and monitoring tool that trusts the status line.

## Make error bodies consistent

Pick one error shape and use it everywhere. Clients will write one handler for it. There's a standard worth borrowing, **Problem Details** (RFC 7807, updated as RFC 9457), served as `application/problem+json`:

```json
{
  "type": "https://api.example.com/errors/validation",
  "title": "Validation failed",
  "status": 422,
  "detail": "One or more fields are invalid.",
  "errors": [
    { "field": "title", "message": "must not be empty" },
    { "field": "subject", "message": "unknown subject code" }
  ]
}
```

Include a machine-readable identifier (`type` or a `code` field) so clients branch on that, not on the human message. Never leak stack traces or SQL errors in production responses.

## Paginate from day one

Any list endpoint will eventually be too large to return in one go. There are two common approaches.

**Offset pagination** is the familiar one:

```http
GET /notes?limit=20&offset=40
```

It's easy to implement and lets you jump to page 7. But it has two problems. Large offsets get slow, because the database still walks past every skipped row. And if items are inserted or deleted while someone pages through, they'll see duplicates or miss rows.

**Cursor pagination** returns an opaque token pointing at the last item seen:

```http
GET /notes?limit=20&cursor=eyJpZCI6MTIzNH0
```

```json
{
  "data": [ { "id": 1235, "title": "DBMS unit 3" } ],
  "next_cursor": "eyJpZCI6MTI1NH0",
  "has_more": true
}
```

Under the hood the cursor encodes something like "id greater than 1234", which turns into an indexed `WHERE id > ? ORDER BY id LIMIT 20`. It stays fast and stable under writes. The trade-off is no random page access.

My default: cursor pagination for feeds and anything that grows, offset for small admin tables where "go to page 5" matters. Either way, set a sensible default `limit` and a hard maximum.

## Idempotency keys for unsafe retries

Networks fail. A client sends `POST /payments`, the connection drops, and it has no idea whether the payment went through. Retrying might charge twice.

`GET`, `PUT` and `DELETE` are defined as **idempotent**: doing them twice has the same effect as doing them once. `POST` isn't. The fix is an **idempotency key**: the client generates a unique value and sends it with the request.

```http
POST /payments
Idempotency-Key: 7b4c1f0e-2a9d-4c55-9e1a-3f2d8b6c0a11
Content-Type: application/json

{ "amount": 49900, "currency": "INR" }
```

The server stores the key with the result. If the same key arrives again, it returns the stored response instead of doing the work twice. A few details matter: scope keys per user, expire them after a reasonable window, and reject a reused key that comes with a *different* body.

## Version deliberately

You will need to make breaking changes. Plan for it.

- **URL versioning** (`/v1/notes`) is the most visible and easiest to route and cache. Most public APIs do this.
- **Header versioning** (`Accept: application/vnd.example.v2+json` or a custom header) keeps URLs clean but is harder to test in a browser.

Whichever you choose, the bigger discipline is **not breaking things inside a version**. Adding a field is fine. Renaming, removing, or changing a field's type is not. Clients should ignore fields they don't recognise, and you should document that expectation.

## What I'd tell my past self

- Nouns in the path, verbs in the method.
- Honest status codes, one error format, no `200` failures.
- Paginate every list, and prefer cursors for anything that grows.
- Accept an `Idempotency-Key` on any `POST` that moves money or sends messages.
- Put `/v1` in the URL now, and treat every field you ship as a promise.

None of this is clever. That's the point: a boring, predictable API is the one people enjoy integrating with.
