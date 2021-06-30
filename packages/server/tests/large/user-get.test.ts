import request from "supertest";
import createApp from "../../src/app";
import { setupPrisma, getXApigatewayEvent, createUser1 } from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);

test("単一のユーザーが取得できること", async () => {
  const { user, board, board2 } = await createUser1(prisma);

  const res = await request(createApp())
    .get(`/user`)
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual({
    ...user,
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    boards: [
      {
        ...board,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      {
        ...board2,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    ],
  });
});

/**
 * cognito userは作成したがまだuser createしていない状態で Get user を呼び出した場合
 */
test("Userが存在しない場合、404エラーとなること", async () => {
  const res = await request(createApp())
    .get(`/user`)
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});
