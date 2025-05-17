import { DataTypes, Model, Sequelize } from "sequelize";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
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
  declare password: string;
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

  public static async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  public async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
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
      },
      email: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      password: {
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
  UserSchema.addHook("afterUpdate", function (user) {
    if (user.changed("password" as keyof Model<UserSchema>)) {
      console.log("Password has been changed");
    }
  });

  return user;
}
