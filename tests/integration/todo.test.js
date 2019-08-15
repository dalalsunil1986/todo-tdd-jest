const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mock-data/new-todo.json");
const updatedTodo = require("../mock-data/updated-todo.json");

const baseUrl = "/todos/";

let todoId, todoBody;

describe("TodoRoutes", () => {
  test("POST " + baseUrl, () => {
    return request(app)
      .post(baseUrl)
      .send(newTodo)
      .then(response => {
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toEqual(newTodo.title);
        expect(response.body.done).toEqual(newTodo.done);
        expect(response.body._id).toBeDefined();
      });
  });
  test("ERROR POST " + baseUrl, () => {
    return request(app)
      .post(baseUrl)
      .send({ title: "wash dishes" })
      .catch(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).ToEqual({
          message: "Todo validation failed: done: Path `done` is required."
        });
      });
  });
  test("GET " + baseUrl, () => {
    return request(app)
      .get(baseUrl)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).not.toBe({});
        expect(response.body[0]._id).toBeDefined();
        todoId = response.body[0]._id;
        todoBody = response.body[0];
      });
  });
  test("GET " + baseUrl + ":todoId", () => {
    return request(app)
      .get(baseUrl + todoId)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).not.toBe({});
        expect(response.body._id).toBeDefined();
      });
  });
  test("GET " + baseUrl + ":todoId that's invalid'", () => {
    return request(app)
      .get(baseUrl + "not-existing-id")
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
          message:
            'Cast to ObjectId failed for value "not-existing-id" at path "_id" for model "Todo"'
        });
      });
  });
  test("PUT " + baseUrl + ":todoId", () => {
    return request(app)
      .put(baseUrl + todoId)
      .send(updatedTodo)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual(updatedTodo);
      });
  });
  test("DELETE " + baseUrl + ":todoId", () => {
    return request(app)
      .delete(baseUrl + todoId)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual(todoBody);
      });
  });
});
