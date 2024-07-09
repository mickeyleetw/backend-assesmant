import { DataTypes } from 'sequelize'
import { Table, Column, type ModelCtor, Model, HasMany } from 'sequelize-typescript'
import { DB_SCHEMA } from '../settings/database'

@Table({ schema: DB_SCHEMA, tableName: 'user', modelName: 'User' })
export class User extends Model<User> {
  @Column({
    type: DataTypes.STRING,
    allowNull: false
  })
  declare username: string

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  declare avatar: string

  @Column({
    type: DataTypes.STRING,
    allowNull: false
  })
  declare password: string

}
export const UserModel = User as ModelCtor
export default User
