---
title: "REST API Design Basics I Wish I'd Learned Earlier"
date: 2024-11-23
tags: ["post", "backend", "guides"]
---

I wrote plenty of APIs in college that technically worked and were still horrible to use. Routes with random names, errors that always returned `200`, and response shapes that changed depending on which endpoint I'd written that week. The frontend eventually has to deal with all of that nonsense.

Most of the fixes aren't complicated. They're just much easier to get right before people start depending on the API.

## Model resources, not actions

I find it much easier to design routes around **things** rather than actions. Notes, users, comments, payments: those are resources. HTTP already has methods describing what you want to do with them. You don't have to invent a new verb in every URL.

```http
GET    /notes            list notes
POST   /notes            create a note
GET    /notes/42         fetch one note
PATCH  /notes/42         update part of it
DELETE /notes/42         delete it
GET    /notes/42/comments  comments belonging to note 42
```

Please don't create `/getNotes`, `/createNote` and `/deleteNoteById` if the HTTP method is already doing that job. You end up inventing a naming convention for something HTTP already has one for.

Not every operation fits neatly into create/read/update/delete. Publishing a note or requesting a password reset might deserve an action endpoint such as `POST /notes/42/publish`. That's fine. I just wouldn't design the entire API as a collection of arbitrary function names.

I stick to plural lowercase paths and try not to nest resources five levels deep. At some point `/comments?note_id=42` is easier to use than a URL that reads like the entire database relationship graph.

## Use status codes properly

The status code is part of the contract with the client. It tells the frontend whether the request succeeded, whether authentication is needed and whether retrying makes sense. You shouldn't have to parse an English error message to figure that out. These are the ones I reach for most often:

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

My pet peeve: returning **`200` with `"success": false`**. You've told every HTTP client, proxy and monitoring system that the request succeeded, and hidden the failure in a JSON field. Just send the correct status code.

## Make error bodies consistent

I used to underestimate how annoying inconsistent errors are for whoever writes the frontend. If one route returns a string, another returns `{error: ...}`, and the third returns an HTML page, every integration gets its own pile of exception handling. Pick one structure. **Problem Details**, standardised in RFC 9457 (building on RFC 7807), is a good starting point:

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

Give clients an identifier they can depend on, such as `type` or a stable error code. The human-readable message can change without breaking them. And nobody outside your team needs a database stack trace in the response body.

## Paginate from day one

That endpoint returning a handful of notes today might return fifty thousand next year. Don't make the frontend download all of them and then call pagination a future improvement. There are two common approaches, and each has a trade-off.

**Offset pagination** is simple and familiar:

```http
GET /notes?limit=20&offset=40
```

It's nice when somebody wants to jump straight to page seven. The catch is that skipping a huge number of records can be expensive, and inserting or deleting rows while someone pages through the list can shift the results. That's how a user ends up seeing the same item twice or missing one entirely.

**Cursor pagination** avoids some of that by giving the client a token representing where the previous page ended:

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

That cursor might encode something like "continue after ID 1234". The server can translate it into a query such as `WHERE id > ? ORDER BY id LIMIT 20`, using a suitable index. This works well for feeds where records keep arriving. What you lose is the convenient "jump to page 37" behaviour.

I lean towards cursors for feeds and growing datasets, offsets for modest admin tables where people genuinely navigate by page number. Either way, set a default page size and an upper limit. Clients shouldn't be able to accidentally request a million rows.

## Idempotency keys for unsafe retries

Here's a failure I really don't want: a customer submits a payment, the network drops before the response arrives, and the app retries. The first payment may already have succeeded. Without protection, you've just charged the customer twice because the connection was unreliable.

HTTP defines `GET`, `PUT` and `DELETE` as **idempotent** in their intended semantics. `POST` generally isn't. For a sensitive action like creating a payment, have the client send a unique **idempotency key** so the server can recognise a retry of the same operation.

```http
POST /payments
Idempotency-Key: 7b4c1f0e-2a9d-4c55-9e1a-3f2d8b6c0a11
Content-Type: application/json

{ "amount": 49900, "currency": "INR" }
```

The server stores the key with the result. If the same request arrives again, it returns the stored response instead of charging the customer twice. Scope keys per user, expire them after a sensible period and reject a reused key with a different request body. This is the kind of detail that looks unnecessary until a flaky connection charges somebody twice.

## Version deliberately

Eventually you'll want to change a response in a way an old client can't handle. That's going to be painful if versioning never crossed your mind.

- **A version in the path**, like `/v1/notes`, is obvious and easy to route. I like that clarity for most public APIs.
- **A version in a header** keeps the URL cleaner, but it can make manual testing and debugging less convenient. It's a legitimate choice if you have a reason for it.

The important part isn't winning a philosophical argument over URL versus header versions. It's resisting breaking changes inside an existing version. Adding an optional field is usually manageable. Renaming a field or silently changing its type can break consumers you don't even know exist. Make compatibility part of the contract.

## What I'd tell my past self

- I'd name routes around resources and let HTTP methods say what happens to them.
- I'd never make clients decode a failed `200` response to discover an error.
- I'd put pagination in early, before the dataset gets big enough to cause trouble.
- For non-repeatable operations like payments, I'd implement safe retry behaviour using idempotency keys.
- I'd version the interface and remember that other people's code will depend on the fields I publish.

I don't want an API to be clever. I want to know what it'll return without opening the backend code every time. Predictability is underrated when somebody else has to integrate with your work.
