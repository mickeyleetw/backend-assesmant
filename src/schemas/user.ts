import {
  IsString,
  Length,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  isNotEmpty,
  IsNumber
} from 'class-validator'

class UserSignUpSchema {
  @IsNotEmpty()
  @Length(1, 20)
  @IsString()
  declare username: string

  @Length(8)
  @IsString()
  @IsNotEmpty()
  declare password: string


  @IsNotEmpty()
  declare avatar: string
}

class RetrieveUserSchema {
  constructor (username: string, password: string, isActive: boolean,avatar: string) {
    this.username = username
    this.password = password
    this.isActive= isActive
    this.avatar= avatar
  }

  @Length(1, 20)
  @IsString()
  @IsNotEmpty()
  declare username: string

  @Length(8)
  @IsString()
  @IsNotEmpty()
  declare password: string

  @IsBoolean()
  @IsNotEmpty()
  declare isActive: boolean

  @IsNotEmpty()
  declare avatar: string

}

class UserLogInSchema {
  @IsString()
  @IsNotEmpty()
  declare username: string

  @Length(8)
  @IsString()
  @IsNotEmpty()
  declare password: string
}

class ResetPasswordSchema {
  @IsNumber()
  @IsNotEmpty()
  declare userId: number

  @IsString()
  @IsNotEmpty()
  declare username: string

  @Length(8)
  @IsString()
  @IsNotEmpty()
  declare newPassword: string
}

class JwtTokenSchema {
  constructor (token: string) {
    this.bearerJWT = `Bearer ${token}`
  }

  @IsString()
  declare bearerJWT: string
}

export { UserSignUpSchema, UserLogInSchema, ResetPasswordSchema, RetrieveUserSchema, JwtTokenSchema }
