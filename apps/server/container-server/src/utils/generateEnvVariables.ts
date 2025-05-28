export const generateEnvVariables = (env: any): string => {
  return [env].map(({ key, value }) => `${key}='${value}'`).join('\n');
};
