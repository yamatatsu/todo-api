import request from "supertest";
import app from "../../src/app";
import { getXApigatewayEvent, setupPrisma } from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);

test("複数のTaskが取得できること", async () => {
  const data = await prisma.user.create({
    data: {
      sub: "test-user-sub1",
      name: "test-user-name1",
      boards: {
        create: {
          title: "test-board-title1",
          tasks: {
            create: [
              { title: "test-task-title1" },
              { title: "test-task-title2" },
            ],
          },
        },
      },
    },
    include: { boards: { include: { tasks: true } } },
  });
  await prisma.board.create({
    data: {
      authorId: data.id,
      title: "test-board-title2",
      tasks: { create: [{ title: "test-task-title3" }] },
    },
    include: { tasks: true },
  });

  const board = data.boards[0];

  const res = await request(app)
    .get(`/board/${board.id}/tasks`)
    .set("x-apigateway-event", getXApigatewayEvent(data.sub))
    .set("x-apigateway-context", "{}");

  expect(res.body).toEqual([
    {
      boardId: board.id,
      createdAt: expect.any(String),
      description: null,
      id: expect.any(Number),
      title: "test-task-title1",
      updatedAt: expect.any(String),
    },
    {
      boardId: board.id,
      createdAt: expect.any(String),
      description: null,
      id: expect.any(Number),
      title: "test-task-title2",
      updatedAt: expect.any(String),
    },
  ]);
});

test("404　エラーとなること", async () => {
  const data = await prisma.user.create({
    data: {
      sub: "test-user-sub1",
      name: "test-user-name1",
      boards: {
        create: {
          title: "test-board-title1",
          tasks: {
            create: [
              { title: "test-task-title1" },
              { title: "test-task-title2" },
            ],
          },
        },
      },
    },
    include: { boards: { include: { tasks: true } } },
  });

  const res = await request(app)
    .get(`/board/0/tasks`)
    .set("x-apigateway-event", getXApigatewayEvent(data.sub))
    .set("x-apigateway-context", "{}");
  expect(res.status).toEqual(404);
});

test("404　エラーとなること", async () => {
  const data = await prisma.user.create({
    data: {
      sub: "test-user-sub1",
      name: "test-user-name1",
      boards: {
        create: {
          title: "test-board-title1",
          tasks: {
            create: [
              { title: "test-task-title1" },
              { title: "test-task-title2" },
            ],
          },
        },
      },
    },
    include: { boards: { include: { tasks: true } } },
  });

  const res = await request(app)
    .get(`/board/${data.boards[0].id}/tasks`)
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");
  expect(res.status).toEqual(404);
});

test("404　エラーとならずに`[]`を返すこと", async () => {
  const data = await prisma.user.create({
    data: {
      sub: "test-user-sub1",
      name: "test-user-name1",
      boards: {
        create: {
          title: "test-board-title1",
        },
      },
    },
    include: { boards: true },
  });

  const res = await request(app)
    .get(`/board/${data.boards[0].id}/tasks`)
    .set("x-apigateway-event", getXApigatewayEvent(data.sub))
    .set("x-apigateway-context", "{}");
  expect(res.status).toEqual(200);
  expect(res.body).toEqual([]);
});
