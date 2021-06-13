import { getSecret } from "./secrets";
import { getEnv } from "./env";

export const NODE_ENV = getEnv("NODE_ENV");
export const PRODUCTION = NODE_ENV === "production";

export async function getDbUrl() {
  if (PRODUCTION) {
    const { engine, username, password, host, port } = await getSecret();
    console.info({ engine, host, port });

    return `${engine}://${username}:${password}@${host}:${port}/tadb`;
  } else {
    return getEnv("DATABASE_URL");
  }
}
