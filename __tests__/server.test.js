const endpointsJson = require("../endpoints.json");
const server = require("../server");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");

beforeAll(() => seed(testData));
afterAll(() => db.end());

describe("GET /api-topics", () => {
  test("404: Responds with an error NotFound when Unavailable Route is passed", () => {
    return request(server).get("/api-topics").expect(404);
  });
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(server)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with  array of topic objects, each of which should have the following properties: slug, description", () => {
    return request(server)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);

        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object", () => {
    return request(server)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });

  test("400: Responds with an error when an id is bad request", () => {
    return request(server)
      .get("/api/articles/two")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("404: Responds with an error when an article with such an id is not found", () => {
    return request(server)
      .get("/api/articles/567567")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article ID not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with array of article objects", () => {
    return request(server)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);

        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toHaveProperty("comment_count");
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            article_img_url: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
            comment_count: expect.any(String),
          });
        });

        const sortedArticles = [...articles].sort(
          (a, b) => a.created_at - b.created_at
        );
        expect(articles).toEqual(sortedArticles);
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with array of user objects", () => {
    return request(server)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);

        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comment objects for the given article_id", () => {
    return request(server)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(2);

        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 3,
          });
        });

        const sortedComments = [...comments].sort(
          (a, b) => a.created_at - b.created_at
        );
        expect(comments).toEqual(sortedComments);
      });
  });

  test("400: Responds with an error when an id is bad request", () => {
    return request(server)
      .get("/api/articles/three/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("404: Responds with an error when an article with such an id is not found", () => {
    return request(server)
      .get("/api/articles/3456467/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article ID not found");
      });
  });

  test("200: Responds with an emty array when the article exists but has not comments", () => {
    return request(server)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment", () => {
    return request(server)
      .post("/api/articles/2/comments")
      .send({ username: "icellusedkars", body: "Hmmm... Interesting..." })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 19,
          votes: 0,
          created_at: expect.any(String),
          author: "icellusedkars",
          body: "Hmmm... Interesting...",
          article_id: 2,
        });
      });
  });

  test("POST:400 responds with an appropriate status and error message when provided with a bad comment (no usename)", () => {
    return request(server)
      .post("/api/articles/4/comments")
      .send({
        body: "Hmmm... Interesting...",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("400: Responds with an error when an id is bad request", () => {
    return request(server)
      .post("/api/articles/two/comments")
      .send({ username: "icellusedkars", body: "Hmmm... Interesting..." })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("400: Responds with an error when a user does not exist", () => {
    return request(server)
      .post("/api/articles/two/comments")
      .send({ username: "icecream_lover", body: "Hmmm... Interesting..." })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("404: Responds with an error when an article with such an id is not found", () => {
    return request(server)
      .post("/api/articles/868/comments")
      .send({ username: "icellusedkars", body: "Hmmm... Interesting..." })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article ID not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with an updated article", () => {
    return request(server)
      .patch("/api/articles/1")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });

  test("400: Responds with an appropriate status and error message when provided with a bad inc_votes", () => {
    return request(server)
      .patch("/api/articles/1")
      .send({ inc_votes: "cat" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("400: Responds with an error when an id is bad request", () => {
    return request(server)
      .patch("/api/articles/one")
      .send({ inc_votes: -100 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("404: Responds with an error when an article with such an id is not found", () => {
    return request(server)
      .patch("/api/articles/567")
      .send({ inc_votes: -100 })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article ID not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: No content", () => {
    return request(server).delete("/api/comments/2").expect(204);
  });

  test("400: Responds with an error when an id is bad request", () => {
    return request(server)
      .delete("/api/comments/two")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("404: Responds with an error when an article with such an id is not found", () => {
    return request(server)
      .delete("/api/comments/9999")
      .then((response) => {
        expect(response.body.msg).toBe("Comment ID not found");
      });
  });
});
