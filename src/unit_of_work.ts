import { Transaction } from 'sequelize'
import { RDBUserRepository} from './repositories'
import { SequelizeConnection } from './settings'

export default class AsyncSequelizeUnitOfWork {
  private readonly sequelize = SequelizeConnection.getInstance()
  private readonly transaction = this.sequelize.transaction(
    {
      autocommit: false,
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
      type: Transaction.TYPES.DEFERRED
    }

  )

  public userRepo: RDBUserRepository

  constructor () {
    this.userRepo = new RDBUserRepository(this.transaction)
  }

  async enter (): Promise<AsyncSequelizeUnitOfWork> {
    return this
  }

  async exit (): Promise<void> {
    const transaction = await this.transaction
    try {
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    } finally {
      (transaction as any).finished = null
    }
  }
}
