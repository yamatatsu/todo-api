import request from "supertest";
import createApp from "../../src/app";
import { setupPrisma, getXApigatewayEvent, createUser1 } from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);

test("ユーザーが更新できること", async () => {
  const { user } = await createUser1(prisma);

  const res = await request(createApp())
    .put(`/user`)
    .send({ name: "test-user-name1:updated" })
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual({ count: 1 });
});

test("更新されずに正常を返すこと", async () => {
  const { user } = await createUser1(prisma);

  const res = await request(createApp())
    .put(`/user`)
    .send({})
    .set("x-apigateway-event", getXApigatewayEvent(user.sub))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(200);
  expect(res.body).toEqual({ count: 1 });
});

/**
 * cognito userは作成したがまだuser createしていない状態で Get user を呼び出した場合
 */
test("404　エラーとなること", async () => {
  const res = await request(createApp())
    .put(`/user`)
    .send({ name: "test-user-name1:updated" })
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});
