import { DB_SCHEMA, SequelizeConnection } from './settings'
import { type Sequelize } from 'sequelize-typescript'
import { UserModel} from './models'

async function resetDB (): Promise<void> {
  const sequelize = await SequelizeConnection.connect()

  console.log('Reset DB starting...')
  await purgeDB(sequelize)
  await createSchema(sequelize)
  await createTables(sequelize)
  console.log('Create DB done')
  await sequelize.close()
}

async function purgeDB (sequelize: Sequelize): Promise<void> {
  try {
    const existedSchemas = await sequelize.showAllSchemas({ logging: false, benchmark: true })
    console.log(DB_SCHEMA)
    if (existedSchemas.includes({ DB_SCHEMA })) {
      await sequelize.dropSchema(DB_SCHEMA, { logging: console.log, benchmark: true })
      console.log('Dropping db schema...')
    }
    console.log('purge db successful.')
  } catch (e) {
    console.log(e)
    throw e
  }
}

async function createSchema (sequelize: Sequelize): Promise<void> {
  try {
    const existedSchemas = await sequelize.showAllSchemas({ logging: console.log, benchmark: true })
    if (!existedSchemas.includes({ DB_SCHEMA })) {
      await sequelize.createSchema(DB_SCHEMA, { logging: console.log, benchmark: true })
      console.log('Create db schema...')
      await sequelize.sync({ force: true })
      console.log('create db schema successful.')
    }
  } catch (e) {
    console.log(e)
    throw e
  }
}

async function createTables (sequelize: Sequelize): Promise<void> {
  try {
    console.log('Creating db Tables...')
    sequelize.addModels([UserModel])

    for (const modelName in sequelize.models) {
      console.log(` - ${modelName}`)
    }
    await sequelize.sync({ force: true })
    console.log('create db tables successful.')
  } catch (e) {
    console.log(e)
    throw e
  }
}

resetDB().then().catch(console.error)
