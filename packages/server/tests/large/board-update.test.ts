import request from "supertest";
import app from "../../src/app";
import { setupPrisma, getXApigatewayEvent, createUser1 } from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);

test("Boardが更新できること", async () => {
  const { user, board } = await createUser1(prisma);

  const body = {
    title: "test-board-title2",
    description: "test-board-description2",
  };
  const res = await request(app)
    .put(`/board/${board.id}`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual({
    count: 1,
  });
});

test("404エラーとなること", async () => {
  const { user } = await createUser1(prisma);

  const body = {
    title: "test-board-title2",
    description: "test-board-description2",
  };
  const res = await request(app)
    .put(`/board/dummy-boardId`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("404エラーとなること", async () => {
  const { board } = await createUser1(prisma);

  const body = {
    title: "test-board-title2",
    description: "test-board-description2",
  };
  const res = await request(app)
    .put(`/board/${board.id}`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("400エラーとなること", async () => {
  const { user, board } = await createUser1(prisma);

  const body = {
    title: 1111111111111,
    description: "test-board-description2",
  };
  const res = await request(app)
    .put(`/board/${board.id}`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(400);
  expect(res.body).toEqual({
    issues: [
      {
        code: "invalid_type",
        expected: "string",
        message: "Expected string, received number",
        path: ["title"],
        received: "number",
      },
    ],
  });
});
