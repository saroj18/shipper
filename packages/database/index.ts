import mongoose, { Mongoose } from 'mongoose';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { getSequelizeInstance } from './models/user.model.js';

dotenv.config();

interface DBConnection {
  connect: () => Promise<any>;
}

export class MongoDBConnection implements DBConnection {
  private constructor() {}
  private static instance: Mongoose;

  public static async getInstance(): Promise<Mongoose> {
    if (!MongoDBConnection.instance) {
      const dbConnection = new MongoDBConnection();
      const connection = await dbConnection.connect();
      if (!connection) {
        throw new Error('Failed to establish MongoDB connection');
      }
      MongoDBConnection.instance = connection;
    }
    return MongoDBConnection.instance;
  }
  async connect() {
    try {
      const dbConnection = await mongoose.connect('mongodb://localhost:27017/shipper');
      return dbConnection;
    } catch (error) {
      console.error('MongoDB Connection Error:', error);
    }
  }
}

export class MySQLConnection implements DBConnection {
  private constructor() {}
  private static instance: Sequelize;
  public static async getInstance(): Promise<Sequelize> {
    if (!MySQLConnection.instance) {
      const dbConnection = new MySQLConnection();
      const connection = await dbConnection.connect();
      if (!connection) {
        throw new Error('Failed to establish MySQL connection');
      }
      MySQLConnection.instance = connection;
    }
    return MySQLConnection.instance;
  }

  async connect() {
    try {
      const sequelize = new Sequelize('shipper', 'root', 'password', {
        host: 'localhost',
        port: 3306,
        dialect: 'mysql',
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
      console.error('MySQL Connection Error:', error);
    }
  }
}
