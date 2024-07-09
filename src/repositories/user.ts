import { type Transaction } from 'sequelize'
import { type UserSignUpSchema, RetrieveUserSchema, type UserLogInSchema, JwtTokenSchema, type ResetPasswordSchema } from '../schemas'
import { type User, UserModel } from '../models'
import { ResourceNotFoundError, AuthenticationFailedError } from '../core/errors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.SECRET_KEY ?? 'secret'

class UserEntityConverter {
  public convertUserORMModelToEntity (user: User): RetrieveUserSchema {
    return new RetrieveUserSchema(
      user.username,
      user.password,
      true,
      user.avatar
    )
  }
}

class IUserRepository {
  async createUser (data: UserSignUpSchema): Promise<number> {
    throw new Error('Method not implemented.')
  }

  async retrieveUser (userId: number): Promise<RetrieveUserSchema> {
    throw new Error('Method not implemented.')
  }

  async isUserExisted (userId: number): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  async isUserCreatable (userName: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  async authUser (data: UserLogInSchema): Promise<JwtTokenSchema> {
    throw new Error('Method not implemented.')
  }

  async updateUserPassword (data: ResetPasswordSchema): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

class RDBUserRepository extends IUserRepository {
  private readonly transaction: Promise<Transaction>
  private readonly converter = new UserEntityConverter()

  constructor (transaction: Promise<Transaction>) {
    super()
    this.transaction = transaction
  }

  async createUser (data: UserSignUpSchema): Promise<number> {
    const hashedPassword = await bcrypt.hash(data.password, 12)
    const user = await UserModel.create(
      {
        username: data.username,
        avatar: data.avatar,
        password: hashedPassword
      },
      {
        transaction: await this.transaction
      }
    )
    return user.id
  }

  async _getUserById (userId: number): Promise<User> {
    const user = await UserModel.findOne(
      {
        where: { id: userId },
        transaction: await this.transaction
      }
    )
    if (user === null) {
      throw new ResourceNotFoundError('User')
    }
    return user as User
  }


  async _getUserByName (username: string): Promise<User> {
    const user = await UserModel.findOne(
      {
        where: { username},
        transaction: await this.transaction
      }
    )
    if (user === null) {
      throw new ResourceNotFoundError('User')
    }
    return user as User
  }

  async isUserExisted (userId: number): Promise<boolean> {
    const user = await UserModel.findOne(
      {
        where: { id:userId },
        transaction: await this.transaction
      }
    )
    return user !== null
  }

  async isUserCreatable (userName: string): Promise<boolean> {
    const user = await UserModel.findOne(
      {
        where: { username: userName},
        transaction: await this.transaction
      }
    )
    return user == null
  }

  async retrieveUser (userId: number): Promise<RetrieveUserSchema> {
    const user = await UserModel.findByPk(userId, { transaction: await this.transaction })
    if (user === null) {
      throw new ResourceNotFoundError('User')
    }
    return this.converter.convertUserORMModelToEntity(user as User)
  }

  async authUser (userLogIn: UserLogInSchema): Promise<JwtTokenSchema> {
    const user = await this._getUserByName(userLogIn.username)
    const passwordMatch = await bcrypt.compare(userLogIn.password, user.password)
    if (!passwordMatch) {
      throw new AuthenticationFailedError(204,'Password incorrect')
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username},
      SECRET_KEY,
      {
      algorithm: 'HS256',
      expiresIn: '2m'
      }
    )
    return new JwtTokenSchema(token)
  }

  async updateUserPassword (data: ResetPasswordSchema): Promise<void> {
    const user = await this._getUserById(data.userId)
    const hashedPassword = await bcrypt.hash(data.newPassword, 12)
    await user.update(
      {
        password: hashedPassword
      },
      {
        transaction: await this.transaction
      }
    )
  }
}

export default RDBUserRepository
