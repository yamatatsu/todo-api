import request from "supertest";
import app from "../../src/app";
import { setupPrisma, getXApigatewayEvent } from "./helper";

const prisma = setupPrisma();

jest.retryTimes(2);

test("単一のユーザーが取得できること", async () => {
  const data = await prisma.user.create({
    data: { sub: "test-sub", name: "test-name" },
  });
  const res = await request(app)
    .get(`/user`)
    .set("x-apigateway-event", getXApigatewayEvent(data.sub))
    .set("x-apigateway-context", "{}");

  expect(res.body).toEqual(data);
});

/**
 * cognito userは作成したがまだuser createしていない状態で Get user を呼び出した場合
 */
test("404　エラーとなること", async () => {
  const res = await request(app)
    .get(`/user`)
    .set("x-apigateway-event", getXApigatewayEvent("dummy-sub"))
    .set("x-apigateway-context", "{}");

  expect(res.status).toEqual(404);
});
