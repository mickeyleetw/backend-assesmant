import factory from 'factory-girl'
import faker from 'faker'
import { UserSignUpSchema } from '../user'

class UserSignUpSchemaFactory extends UserSignUpSchema {
  constructor (object: UserSignUpSchemaFactory) {
    super()
    this.username = object.username
    this.avatar = object.avatar
    this.password = object.password
  }
}

factory.define('UserSignUpSchemaFactory', UserSignUpSchemaFactory,
  {
    username: faker.internet.userName(),
    avatar: faker.internet.avatar(),
    password: faker.internet.password()
  })

export { factory as userSchemaFactory }
