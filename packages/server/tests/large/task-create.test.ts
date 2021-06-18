import request from "supertest";
import app from "../../src/app";
import { setupPrisma, getXApigatewayEvent } from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);

test("Taskが作成できること", async () => {
  const user = await prisma.user.create({
    data: {
      sub: "test-sub",
      name: "test-name",
      boards: {
        create: {
          title: "test-board-title",
          description: "test-description-description",
        },
      },
    },
    include: { boards: true },
  });

  const board = user.boards[0];

  const body = { title: "test-title", description: "test-description" };
  const res = await request(app)
    .post(`/board/${board.id}/task`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual({
    id: expect.any(Number),
    ...body,
    boardId: board.id,
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  });
});

test("404エラーとなること", async () => {
  const user = await prisma.user.create({
    data: {
      sub: "test-sub",
      name: "test-name",
      boards: {
        create: {
          title: "test-board-title",
          description: "test-description-description",
        },
      },
    },
    include: { boards: true },
  });

  const board = user.boards[0];

  const body = { title: "test-title", description: "test-description" };
  const res = await request(app)
    .post(`/board/${board.id}/task`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("404エラーとなること", async () => {
  const user = await prisma.user.create({
    data: {
      sub: "test-sub",
      name: "test-name",
      boards: {
        create: {
          title: "test-board-title",
          description: "test-description-description",
        },
      },
    },
  });

  const body = { title: "test-title", description: "test-description" };
  const res = await request(app)
    .post(`/board/dummy-boardId/task`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("404エラーとなること", async () => {
  const user = await prisma.user.create({
    data: {
      sub: "test-sub",
      name: "test-name",
      boards: {
        create: {
          title: "test-board-title",
          description: "test-description-description",
        },
      },
    },
    include: { boards: true },
  });

  const body = { title: "test-title", description: "test-description" };
  const res = await request(app)
    .post(`/board/0/task`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("404エラーとなること", async () => {
  const user = await prisma.user.create({
    data: {
      sub: "test-sub",
      name: "test-name",
      boards: {
        create: {
          title: "test-board-title",
          description: "test-description-description",
        },
      },
    },
    include: { boards: true },
  });

  const board = user.boards[0];

  const body = { description: "test-description" };
  const res = await request(app)
    .post(`/board/${board.id}/task`)
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
