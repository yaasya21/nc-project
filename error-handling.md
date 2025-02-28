# Possible Errors

This is an _**incomplete**_ guide to the possible errors that may happen in your app. We have left some of them blank to prompt you to think about the errors that could occur as a client uses each endpoint that you have created.

Think about what could go wrong for each route, and the HTTP status code should be sent to the client in each case.
For each thing that could go wrong, make a test with your expected status code and then make sure that possibility is handled.

Bear in mind, handling bad inputs from clients doesn't necessarily have to lead to a 4\*\* status code. Handling can include using default behaviours or even ignoring parts of the request.

The following is _not_ a comprehensive list! Its purpose is just to get the ball rolling down the sad path 😢

---

## Relevant HTTP Status Codes

- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 404 Not Found
- 405 Method Not Allowed
- 418 I'm a teapot
- 422 Unprocessable Entity
- 500 Internal Server Error

---

## The Express Documentation

[The Express Docs](https://expressjs.com/en/guide/error-handling.html) have a great section all about handling errors in Express.

## Unavailable Routes

### GET `/not-a-route`

- Invalid (e.g. `/api-get-topics`) -- 404 Not Found

---

## Available Routes

### GET `/api/articles`

- Bad queries: -- 400 Bad Request
  - `sort_by` a column that doesn't exist
  - `order` !== "asc" / "desc"
  - `topic` that is not in the database
  - `topic` that exists but does not have any articles associated with it

### GET `/api/articles/:article_id`

- Bad `article_id` (e.g. `/dog`) -- 400 Bad Request
- Well formed `article_id` that doesn't exist in the database (e.g. `/999999`) -- 404 Not Found

### GET `/api/users/:username`

- Bad `username` (e.g. > 40 chars) -- 400 Bad Request
- Well formed `username` that doesn't exist in the database (e.g. `/user4737248`) -- 404 Not Found

### GET `/api/articles/:article_id/comments`

- Bad `article_id` (e.g. `/dog`) -- 400 Bad Request
- Well formed `article_id` that doesn't exist in the database (e.g. `/999999`) -- 404 Not Found

### POST `/api/articles/:article_id/comments`

- Bad `article_id` (e.g. `/dog`) -- 400 Bad Request
- Well formed `article_id` that doesn't exist in the database (e.g. `/999999`) -- 404 Not Found
- Missing parts of body -- 400 Bad Request

### POST `/api/articles`

- Missing parts of body -- 400 Bad Request
- `author` not found (e.g. `{ author: 54773457 }`) -- 404 Not Found
- `topic` not found (e.g. `{ topic: "science }`) -- 404 Not Found

### POST `/api/topics`

- Missing parts of body (missing slug) -- 400 Bad Request

### PATCH `/api/articles/:article_id`

- Bad `article_id` (e.g. `/dog`) -- 400 Bad Request
- Well formed `article_id` that doesn't exist in the database (e.g. `/999999`) -- 404 Not Found
- Invalid `inc_votes` (e.g. `{ inc_votes : "cat" }`) -- 400 Bad Request

### PATCH `/api/comments/:comment_id`

- Bad `comment_id` (e.g. `/dog`) -- 400 Bad Request
- Well formed `comment_id` that doesn't exist in the database (e.g. `/999999`) -- 404 Not Found
- Invalid `comment_id` (e.g. `{ inc_votes : "cat" }`) -- 400 Bad Request

### DELETE `/api/comments/:comment_id`

- Bad `comment_id` (e.g. `/dog`) -- 400 Bad Request
- Well formed `:comment_id` that doesn't exist in the database (e.g. `/999999`) -- 404 Not Found

### DELETE `/api/articles/:article_id`

- Bad `article_id` (e.g. `/one`) -- 400 Bad Request
- Well formed `article_id` that doesn't exist in the database (e.g. `/999999`) -- 404 Not Found
