import request from "supertest";
import createApp from "../../src/app";
import { setupPrisma, getXApigatewayEvent, createUser1 } from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);

test("Boardが更新できること", async () => {
  const { user, board } = await createUser1(prisma);

  const body = {
    title: "test-board-title2",
    description: "test-board-description2",
  };
  const res = await request(createApp())
    .put(`/board/${board.id}`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual({
    count: 1,
  });
});

test("存在しないboardIdの場合、404エラーとなること", async () => {
  const { user } = await createUser1(prisma);

  const body = {
    title: "test-board-title2",
    description: "test-board-description2",
  };
  const res = await request(createApp())
    .put(`/board/dummy-boardId`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("Userが存在しない場合、404エラーとなること", async () => {
  const { board } = await createUser1(prisma);

  const body = {
    title: "test-board-title2",
    description: "test-board-description2",
  };
  const res = await request(createApp())
    .put(`/board/${board.id}`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("titleが文字列ではない場合、400エラーとなること", async () => {
  const { user, board } = await createUser1(prisma);

  const body = {
    title: 1111111111111,
    description: "test-board-description2",
  };
  const res = await request(createApp())
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

test("文字数チェックエラーとなること", async () => {
  const { user, board } = await createUser1(prisma);

  const body = {
    title: "--------10--------20--------30--------40--------50-",
    description:
      "-------------------------------------------------------------------------------------------------100-------------------------------------------------------------------------------------------------200-------------------------------------------------------------------------------------------------300-------------------------------------------------------------------------------------------------400-------------------------------------------------------------------------------------------------500-",
  };
  const res = await request(createApp())
    .put(`/board/${board.id}`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(400);
  expect(res.body).toEqual({
    issues: [
      {
        code: "too_big",
        inclusive: true,
        maximum: 50,
        message: "Should be at most 50 characters long",
        path: ["title"],
        type: "string",
      },
      {
        code: "too_big",
        inclusive: true,
        maximum: 500,
        message: "Should be at most 500 characters long",
        path: ["description"],
        type: "string",
      },
    ],
  });
});

test("有効文字チェックエラーとなること", async () => {
  const { user, board } = await createUser1(prisma);

  const body = {
    title: `hoge\nhoge`,
    description: "test-description",
  };
  const res = await request(createApp())
    .put(`/board/${board.id}`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(400);
  expect(res.body).toEqual({
    issues: [
      {
        code: "invalid_string",
        message: "Invalid",
        path: ["title"],
        validation: "regex",
      },
    ],
  });
});

test("`<`と`>`がサニタイズされること", async () => {
  const { user, board } = await createUser1(prisma);

  const body = {
    title: "<><>",
    description: "<><>",
  };
  const res = await request(createApp())
    .put(`/board/${board.id}`)
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);

  const { title, description } =
    (await prisma.board.findUnique({ where: { id: board.id } })) ?? {};
  expect({ title, description }).toEqual({
    title: "&lt;&gt;&lt;&gt;",
    description: "&lt;&gt;&lt;&gt;",
  });
});
