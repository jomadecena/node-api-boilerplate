import { Options } from "sequelize";

export const config: { [key: string]: Options } = {
  test: {
    dialect: 'postgres',
  },
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  },
  staging: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  },
  production: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
};