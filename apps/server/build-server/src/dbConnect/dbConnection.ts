import { Sequelize } from "sequelize";
import { getSequelizeInstance } from "../models/index.js";

type DBConfig = {
  db_host: string;
  db_user: string;
  db_password: string;
  db_name: string;
};
export const connectDB = async ({
  db_host,
  db_user,
  db_password,
  db_name,
}: DBConfig) => {
  try {
    const sequelize = new Sequelize(db_name, db_user, db_password, {
      host: db_host,
      port: 3306,
      dialect: "mysql",
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });
    await sequelize.authenticate();
    await sequelize.sync();
    await getSequelizeInstance(sequelize);
    return sequelize;
  } catch (error) {
    throw error;
  }
};
