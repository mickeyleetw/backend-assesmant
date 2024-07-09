import { type Dialect } from 'sequelize'
import { type SequelizeOptions, Sequelize } from 'sequelize-typescript'
import { UserModel} from '../models'
import dotenv from 'dotenv'

const IS_TEST = process.env.IS_TEST ?? 'false'

if (IS_TEST === 'true') {
  dotenv.config({ path: './src/settings/envs/.env.test.local' })
} else {
  dotenv.config({ path: './src/settings/envs/.env.local' })
}

export const DB_TYPE = process.env.DB_TYPE as Dialect
export const DB_HOST = process.env.DB_HOST
export const DB_PORT = Number(process.env.DB_PORT)
export const DB_USERNAME = process.env.DB_USERNAME
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_NAME = process.env.DB_NAME
export const DB_SCHEMA = process.env.DB_SCHEMA ?? 'public'
export const DB_LOGGING = Boolean(process.env.DB_LOGGING)
export const DB_MAX_POOL_SIZE = Number(process.env.DB_MAX_POOL_SIZE)
export const DB_POOL_ACQUIRE_TIMEOUT = Number(process.env.DB_POOL_ACQUIRE_TIMEOUT)
export const DB_POOL_IDLE_CONNECTION_TIME = Number(process.env.DB_POOL_IDLE_CONNECTION_TIME)

// define Database connection （use singleton pattern）
export class SequelizeConnection {
  private static instance: Sequelize

  static getInstance (): Sequelize {
    if (SequelizeConnection.instance === undefined) {
      const dbConfig: SequelizeOptions = {
        dialect: DB_TYPE,
        host: DB_HOST,
        port: DB_PORT,
        database: DB_NAME,
        schema: DB_SCHEMA,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        logging: DB_LOGGING,
        pool: {
          max: DB_MAX_POOL_SIZE,
          acquire: DB_POOL_ACQUIRE_TIMEOUT,
          idle: DB_POOL_IDLE_CONNECTION_TIME
        },
        dialectOptions: {
          sslmode: 'prefer'
        },
        models: [UserModel]
      }

      this.instance = new Sequelize(dbConfig)
    }

    return this.instance
  }

  static async connect (): Promise<Sequelize> {
    const sequelize = SequelizeConnection.getInstance()
    try {
      await sequelize.authenticate()
      console.log('Database connection authenticated successfully')
      return sequelize
    } catch (err) {
      console.log('Error while creation connection to database :: ' + (err as Error).message)
      return sequelize
    }
  }

  async close (): Promise<Sequelize> {
    const sequelize = SequelizeConnection.getInstance()
    try {
      await sequelize.close()
      console.log('Database connection closed successfully')
      return sequelize
    } catch (err) {
      console.log('Error while closing database connection :: ' + (err as Error).message)
      return sequelize
    }
  }
}
