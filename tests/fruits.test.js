import app from '../src/app.js';
import supertest from 'supertest';
import httpStatus from "http-status";

const api = supertest(app);

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
      price: "199",
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
});

describe("GET /fruits/:id", () => {

});