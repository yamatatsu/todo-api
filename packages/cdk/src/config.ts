const ENV_NAME = ["development", "production"] as const;
type EnvName = typeof ENV_NAME[number];

export function assertEnvName(str: string): asserts str is EnvName {
  if (!ENV_NAME.includes(str as EnvName)) {
    throw new Error(`Invalid EnvName has set: ${str}`);
  }
}

export const AccountId: Record<EnvName, string> = {
  development: "407172421073",
  production: "",
};
