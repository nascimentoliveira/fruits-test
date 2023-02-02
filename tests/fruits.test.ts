import app from "../src/app";
import supertest from "supertest";
import httpStatus from "http-status";
import fruits from "../src/data/fruits";

const api = supertest(app);

beforeAll(() => {
  fruits.push({
    id: fruits.length + 1,
    name: "pineapple",
    price: 5999,
  });
  fruits.push({
    id: fruits.length + 1,
    name: "grape",
    price: 5999,
  });
});

afterAll(() => {
  fruits.splice(0, fruits.length);
});

describe("POST /fruits", () => {

  it("Should respond with code 422 when body is invalid", async () => {
    const body = {
      fruit: "apple",
    };

    const result = await api.post("/fruits").send(body);
    expect(result.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("Should respond with code 422 when body is invalid (string in price)", async () => {
    const body = {
      name: "orange",
      price: "one hundred",
    };

    const result = await api.post("/fruits").send(body);
    expect(result.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("Should respond with code 201 when insert valid fruit", async () => {
    const body = {
      name: "banana",
      price: 199,
    };

    const result = await api.post("/fruits").send(body);
    expect(result.status).toEqual(httpStatus.CREATED);
  });

  it("Should respond with code 409 when inserting duplicate fruit", async () => {
    const body = {
      name: "banana",
      price: 159,
    };

    const result = await api.post("/fruits").send(body);
    expect(result.status).toEqual(httpStatus.CONFLICT);
  });

});

describe("GET /fruits", () => {
  it("Should respond with code 200 when requesting fruits array", async () => {

    const result = await api.get("/fruits");
    expect(result.status).toEqual(httpStatus.OK);
    expect(result.body).toEqual(expect.arrayContaining([]));
    expect(result.body).toEqual(expect.arrayContaining([expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      price: expect.any(Number),
    })]));
  });

});

describe("GET /fruits/:id", () => {
  it("Should respond with code 200 when requesting specific fruit", async () => {

    const result = await api.get("/fruits/1");
    expect(result.status).toEqual(httpStatus.OK);
    expect(result.body).toEqual(expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      price: expect.any(Number),
    }));
  });

  it("Should respond with code 404 when requesting fruit with non-existent id ", async () => {

    const result = await api.get("/fruits/20");
    expect(result.status).toEqual(httpStatus.NOT_FOUND);
  });

  it("Should respond with code 404 when requesting fruit with invalid id", async () => {

    const result = await api.get("/fruits/five");
    expect(result.status).toEqual(httpStatus.NOT_FOUND);
  });
});