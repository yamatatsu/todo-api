import request from "supertest";
import app from "../../src/app";
import { setupPrisma, getXApigatewayEvent } from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);
test("ユーザーが作成できること", async () => {
  const body = { name: "test-name" };
  const sub = "test-sub";
  const res = await request(app)
    .post("/user")
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(sub))
    .set("x-apigateway-context", "{}");

  expect(res.body).toEqual({
    id: expect.any(Number),
    ...body,
    sub,
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
  const res = await request(app)
    .post("/user")
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent("test-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.body).toEqual({
    issues: [
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

test("Unique制約エラーとなること", async () => {
  const data = await prisma.user.create({
    data: { sub: "test-sub", name: "test-name" },
  });

  const res = await request(app)
    .post("/user")
    .send({ name: "test-name2" })
    .set("x-apigateway-event", getXApigatewayEvent(data.sub))
    .set("x-apigateway-context", "{}");

  expect(res.body).toEqual({
    message: "A same sub user has found. This user has already created.",
  });
});
