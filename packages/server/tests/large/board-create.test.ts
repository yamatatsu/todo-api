import request from "supertest";
import app from "../../src/app";
import { setupPrisma, getXApigatewayEvent } from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);

test("Boardが作成できること", async () => {
  const user = await prisma.user.create({
    data: { sub: "test-sub", name: "test-name" },
  });

  const body = { title: "test-title", description: "test-description" };
  const res = await request(app)
    .post("/board")
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual({
    id: expect.any(Number),
    authorId: user.id,
    ...body,
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  });
});

test("必須チェックエラーとなること", async () => {
  const user = await prisma.user.create({
    data: { sub: "test-sub", name: "test-name" },
  });

  const body = { description: "test-description" };
  const res = await request(app)
    .post("/board")
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(400);
  expect(res.body).toEqual({
    issues: [
      {
        code: "invalid_type",
        expected: "string",
        message: "Required",
        path: ["title"],
        received: "undefined",
      },
    ],
  });
});

test("400エラーとなること", async () => {
  const body = { title: "test-title", description: "test-description" };
  const res = await request(app)
    .post("/board")
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(400);
  expect(res.body).toEqual({
    message:
      "This user has no user record. It is needed to create a user record.",
  });
});
