const endpointsJson = require("../endpoints.json");
const server = require("../server");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const { checkIfExists } = require("../utils/checkIfExists");

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

describe("POST /api/topics", () => {
  test("201: Responds with the posted topic", () => {
    return request(server)
      .post("/api/topics")
      .send({ slug: "books", description: "classic hobby" })
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic).toMatchObject({
          slug: "books",
          description: "classic hobby",
        });
      });
  });
  test("400: Responds with an appropriate status and error message when provided with a bad topic request body (no slug)", () => {
    return request(server)
      .post("/api/topics")
      .send({
        description: "classic hobby",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object", () => {
    return request(server)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          votes: 0,
          created_at: expect.any(String),
          comment_count: "2",
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
        expect(response.body.msg).toBe("article_id not found");
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
  test("200: Sorts by title in ascending order", () => {
    return request(server)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        const sortedArticles = [...articles].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        expect(articles).toEqual(sortedArticles);
      });
  });
  test("200: Sorts by title in descending order (default)", () => {
    return request(server)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles } }) => {
        const sortedArticles = [...articles].sort((a, b) => {
          return b.title.localeCompare(a.title);
        });
        expect(articles).toEqual(sortedArticles);
      });
  });
  test("400: esponds with an error for invalid sort_by", () => {
    return request(server)
      .get("/api/articles?sort_by=invalid")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toMatch("Invalid sort_by parameter");
      });
  });
  test("400: Responds with an error for invalid order", () => {
    return request(server)
      .get("/api/articles?order=random")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toMatch("Invalid order parameter");
      });
  });
  test("200: Should return articles for a valid topic", () => {
    return request(server)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(
          articles.every((article) => article.topic === "mitch")
        ).toBeTruthy();
      });
  });
  test("200: Should return empty array for a topic with no articles", () => {
    return request(server)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(0);
      });
  });
  test("404: Should return an error for a non-existent topic", () => {
    return request(server)
      .get("/api/articles?topic=science")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("slug not found");
      });
  });
});

describe("POST /api/articles", () => {
  test("201: Responds with the posted article", () => {
    return request(server)
      .post("/api/articles")
      .send({
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
      })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 14,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
          comment_count: 0,
        });
      });
  });
  test("400: Responds with an appropriate status and error message when provided with a bad request body (no body)", () => {
    return request(server)
      .post("/api/articles")
      .send({
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("404: Responds with an appropriate status and error message when provided with a bad request body (author not in the system)", () => {
    return request(server)
      .post("/api/articles")
      .send({
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "icecream_lover",
        body: "I find this existence challenging",
      })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("username not found");
      });
  });
  test("404: Responds with an appropriate status and error message when provided with a bad request body (topic not in the system)", () => {
    return request(server)
      .post("/api/articles")
      .send({
        title: "Living in the shadow of a great man",
        topic: "science",
        author: "butter_bridge",
        body: "I find this existence challenging",
      })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("slug not found");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("204: No content", () => {
    request(server)
      .delete("/api/articles/3")
      .expect(204)
      .then(() => {
        return expect(
          checkIfExists(3, "comments", "article_id")
        ).rejects.toMatchObject({
          status: 404,
          msg: "article_id not found",
        });
      });
  });
  test("400: Responds with an error when an id is bad request", () => {
    return request(server)
      .delete("/api/articles/three")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("404: Responds with an error when an article with such an id is not found", () => {
    return request(server)
      .delete("/api/articles/9999")
      .then((response) => {
        expect(response.body.msg).toBe("article_id not found");
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

describe("GET /api/users/:username", () => {
  test("200: Responds with a user object", () => {
    return request(server)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("404: Responds with an error when a user with such a username is not found", () => {
    return request(server)
      .get("/api/users/icecream_lover")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("username not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comment objects for the given article_id", () => {
    return request(server)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(11);

        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
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
        expect(response.body.msg).toBe("article_id not found");
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
  test("400: Responds with an appropriate status and error message when provided with a bad comment (no usename)", () => {
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
        expect(response.body.msg).toBe("article_id not found");
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
        expect(response.body.msg).toBe("article_id not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Responds with an updated comment", () => {
    return request(server)
      .patch("/api/comments/1")
      .send({ inc_votes: -15 })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 1,
          article_id: 9,
          author: "butter_bridge",
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          created_at: expect.any(String),
          votes: 1,
        });
      });
  });
  test("400: Responds with an appropriate status and error message when provided with a bad inc_votes", () => {
    return request(server)
      .patch("/api/comments/1")
      .send({ inc_votes: "cat" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400: Responds with an error when a comment_id is bad request", () => {
    return request(server)
      .patch("/api/comments/one")
      .send({ inc_votes: -100 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("404: Responds with an error when a comment with such an id is not found", () => {
    return request(server)
      .patch("/api/comments/1567")
      .send({ inc_votes: -100 })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("comment_id not found");
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
        expect(response.body.msg).toBe("comment_id not found");
      });
  });
});
