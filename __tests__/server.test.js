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
    return request(server)
      .get("/api-topics")
      .expect(404)
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

describe("GET /api", () => {
  test("200: Responds with  array of topic objects, each of which should have the following properties: slug, description", () => {
    return request(server)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toEqual([
          {
            description: "The man, the Mitch, the legend",
            slug: "mitch",
          },
          {
            description: "Not dogs",
            slug: "cats",
          },
          {
            description: "what books are made of",
            slug: "paper",
          },
        ]);
      });
  });
});
