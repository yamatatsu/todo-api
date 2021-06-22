import request from "supertest";
import createApp from "../../src/app";
import { setupPrisma, getXApigatewayEvent, createUser1 } from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);

test("Boardが作成できること", async () => {
  const { user } = await createUser1(prisma);

  const body = { title: "test-title", description: "test-description" };
  const res = await request(createApp())
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
  const { user } = await createUser1(prisma);

  const body = { description: "test-description" };
  const res = await request(createApp())
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

test("404エラーとなること", async () => {
  const body = { title: "test-title", description: "test-description" };
  const res = await request(createApp())
    .post("/board")
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});
