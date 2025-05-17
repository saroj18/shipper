type ENVTYPE = {
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  PORT: string;
  ORIGIN: string;
};

export const ENV: ENVTYPE = {
  DB_HOST: process.env.DB_HOST as string,
  DB_USER: process.env.DB_USER as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  DB_NAME: process.env.DB_NAME as string,
  PORT: process.env.PORT as string,
  ORIGIN: process.env.ORIGIN as string,
};
