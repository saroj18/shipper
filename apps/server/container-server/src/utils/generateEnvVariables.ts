export const generateEnvVariables = (env: { key: string; value: string }[]): string => {
  return env.map(({ key, value }) => `${key}=${value}`).join('\n');
};
