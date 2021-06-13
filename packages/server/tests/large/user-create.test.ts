import request from "supertest";
import app from "../../src/app";
import { setupPrisma } from "./helper";

setupPrisma();

jest.retryTimes(2);
test("ユーザーが作成できること", async () => {
  const body = {
    sub: "test-sub",
    name: "test-name",
  };
  const res = await request(app).post("/user").send(body);

  expect(res.body).toEqual({
    id: expect.any(Number),
    sub: "test-sub",
    name: "test-name",
    boards: [
      {
        id: expect.any(Number),
        authorId: expect.any(Number),
        title: "Default",
        description: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        tasks: [
          {
            id: expect.any(Number),
            boardId: expect.any(Number),
            title: "Great Awesome Tutorial",
            description: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ],
      },
    ],
  });
});

test("必須チェックエラーとなること", async () => {
  const body = {};
  const res = await request(app).post("/user").send(body);

  expect(res.body).toEqual({
    issues: [
      {
        code: "invalid_type",
        expected: "string",
        message: "Required",
        path: ["sub"],
        received: "undefined",
      },
      {
        code: "invalid_type",
        expected: "string",
        message: "Required",
        path: ["name"],
        received: "undefined",
      },
    ],
  });
});
