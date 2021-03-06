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
  expect(res.body).toEqual({ count: 1 });
});

test("User未作成の場合、404エラーとなること", async () => {
  const body = { title: "test-title", description: "test-description" };
  const res = await request(createApp())
    .post("/board")
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});

test("titleを指定しない場合、必須チェックエラーとなること", async () => {
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

test("文字数チェックエラーとなること", async () => {
  const { user } = await createUser1(prisma);

  const body = {
    title: "--------10--------20--------30--------40--------50-",
    description:
      "-------------------------------------------------------------------------------------------------100-------------------------------------------------------------------------------------------------200-------------------------------------------------------------------------------------------------300-------------------------------------------------------------------------------------------------400-------------------------------------------------------------------------------------------------500-",
  };
  const res = await request(createApp())
    .post("/board")
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
  const { user } = await createUser1(prisma);

  const body = {
    title: `hoge\nhoge`,
    description: "test-description",
  };
  const res = await request(createApp())
    .post("/board")
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
  const { user, board, board2 } = await createUser1(prisma);

  const body = {
    title: "<><>",
    description: "<><>",
  };
  const res = await request(createApp())
    .post("/board")
    .send(body)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);

  const { title, description } =
    (await prisma.board.findFirst({
      where: { authorId: user.id, id: { notIn: [board.id, board2.id] } },
    })) ?? {};
  expect({ title, description }).toEqual({
    title: "&lt;&gt;&lt;&gt;",
    description: "&lt;&gt;&lt;&gt;",
  });
});
