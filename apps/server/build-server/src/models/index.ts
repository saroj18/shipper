import { Sequelize } from "sequelize";
import { UserModel, UserSchema } from "./users-model.js";

let User: typeof UserSchema;
export async function getSequelizeInstance(sequelizeInstance: Sequelize) {
  User = await UserModel(sequelizeInstance);
}

export { User };
