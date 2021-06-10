export function getEnv(name: string): string {
  const env = process.env[name];
  if (!env) {
    throw new Error(`\`process.env.${name}\` is needed.`);
  }
  return env;
}
