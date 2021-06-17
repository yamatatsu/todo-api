import request from "supertest";
import app from "../../src/app";
import { setupPrisma, getXApigatewayEvent } from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);

test("Boardが更新できること", async () => {
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

test("400エラーとなること", async () => {
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
