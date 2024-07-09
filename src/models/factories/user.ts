import factory from 'factory-girl'
import { User } from '../user'

import faker from 'faker'

class userModelFactory extends User {
  constructor (object: userModelFactory) {
    super()
    this.username = object.username
    this.avatar = object.avatar
    this.password = object.password
  }
}

factory.define('UserModelFactory', userModelFactory,
  {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  }
)

export { factory as userModelFactory }
