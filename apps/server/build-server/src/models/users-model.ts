import { DataTypes, Model, Sequelize } from "sequelize";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ENV } from "../ENV-Config.js";

interface JWTPayload extends JwtPayload {
  id: number;
  username: string;
  email: string;
}

export class UserSchema extends Model {
  declare id: number;
  declare username: string;
  declare email: string;
  declare profile_url: string;
  declare github_token: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public static async generateToken(payload: jwt.JwtPayload) {
    const accessToken = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "7d" });
    const refreshToken = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
  }

  public static verifyAccessToken(token: string) {
    const verifyToken = jwt.verify(token, ENV.JWT_SECRET) as JWTPayload;
    return verifyToken;
  }

  public static verifyRefreshToken(token: string) {
    const verifyToken = jwt.verify(token, ENV.JWT_SECRET) as JWTPayload;
    return verifyToken;
  }
}

export async function UserModel(sequelizeInstance: Sequelize) {
  UserSchema.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      github_token: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },

      profile_url: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
    },
    {
      tableName: "users",
      sequelize: sequelizeInstance,
      timestamps: true,
      underscored: true,
    }
  );
  const tableExists = await sequelizeInstance
    .getQueryInterface()
    .showAllTables()
    .then((tables) => tables.includes("users"));
  if (!tableExists) {
    await UserSchema.sync({ alter: true });
  }
  const user = UserSchema;

  return user;
}
