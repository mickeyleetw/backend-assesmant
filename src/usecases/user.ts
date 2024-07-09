import asyncUnitOfWork from '../dependency_injections'
import {
  UserSignUpSchema,
  UserLogInSchema,
  ResetPasswordSchema,
  RetrieveUserSchema,
  JwtTokenSchema
} from '../schemas'
import { DuplicationRecordError,ResourceNotFoundError,AuthenticationFailedError } from '../core/errors'
import { decodeJwtToken } from '../settings'
import jwt from 'jsonwebtoken'
import e from 'express'
import { stat } from 'fs'
const SECRET_KEY = process.env.SECRET_KEY ?? 'secret'

export default class UserUseCase {
  async createUser (data: UserSignUpSchema): Promise<RetrieveUserSchema> {
    const unitOfWork = await asyncUnitOfWork.enter()
    if (!await unitOfWork.userRepo.isUserCreatable(data.username)) {
      throw new DuplicationRecordError('User')
    }
    const userId = await unitOfWork.userRepo.createUser(data)
    const user = await unitOfWork.userRepo.retrieveUser(userId)
    await asyncUnitOfWork.exit()
    return user
  }

  async userLogIn (data: UserLogInSchema): Promise<JwtTokenSchema> {
    const unitOfWork = await asyncUnitOfWork.enter()
    return await unitOfWork.userRepo.authUser(data)
  }

  async resetPassword (data: ResetPasswordSchema): Promise<void> {
    const unitOfWork = await asyncUnitOfWork.enter()
    if (! await unitOfWork.userRepo.isUserExisted(data.userId)) {
      throw new ResourceNotFoundError('User')
    }
    await unitOfWork.userRepo.updateUserPassword(data)
    await asyncUnitOfWork.exit()
  }

  async validateRefreshToken (data: JwtTokenSchema): Promise<JwtTokenSchema> {
    const decodedToken = await decodeJwtToken(data.bearerJWT) as { userId: number, userName: string, exp: number }
    if (decodedToken.exp < Date.now() / 1000) {
      const token = jwt.sign(
        { userId: decodedToken.userId, username: decodedToken.userName},
        SECRET_KEY,
        {
        algorithm: 'HS256',
        expiresIn: '5m'
        }
      )
      const new_token = new JwtTokenSchema(token)
      return new_token
    }else {
      return data
    }
  }

  async validateAccessToken (token:string): Promise<any> {
    try{
      const decodedToken = jwt.verify(token, SECRET_KEY,{ignoreExpiration:true}) as { userId: number, userName: string, exp: number };
      if (decodedToken.exp < Date.now() / 1000) {
        return {status:202, message: 'Token expired', data: {bearerJWT: token}};
      }else {
        return {status:200, message: 'Token valid', data: {bearerJWT: token}};
      }
    }catch (error) {
      throw new AuthenticationFailedError(401, 'Authentication failed')
    }
  }
}
