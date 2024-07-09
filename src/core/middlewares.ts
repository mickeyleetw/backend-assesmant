import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { type Response, type NextFunction } from 'express'
import { type Request } from './express'
import { AppBaseHttpError, RequestValidationFailedError } from './errors'
import { decodeJwtToken } from '../settings'

export const validateAndTransformRequestDataMiddleware = (request: Request, response: Response, next: NextFunction, schema: any): void => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const requestData = plainToInstance(schema, request.body)
  validate(requestData)
    .then(errors => {
      if (errors.length > 0) {
        next(new RequestValidationFailedError(errors.toString()))
      } else {
        request.validatedData = requestData
        next()
      }
    })
    .catch(error => {
      next(error)
    })
}

export const authUserLoginMiddleware = (request: Request, response: Response, next: NextFunction): void => {
  const token = request.headers.authorization?.replace('Bearer ', '') || 'none'
  decodeJwtToken(token).then((decodedToken: any) => {
    if (decodedToken.userName!==request.body.username) {
      throw new Error("User name does not match with token user name")
    }
    request.body.userId = decodedToken.userId
    next()
  }).catch((error: any) => {
    next(error)
  })
}


export const appErrorHandlerMiddleware = (error: AppBaseHttpError | Error, request: Request, response: Response, next: NextFunction): void => {
  if (error instanceof AppBaseHttpError) {
    response.status(error.status).json(
      {
        status: error.status,
        message: error.message
      }
    )
  } else {
    response.status(500).json(
      {
        status: 500,
        message: error.message
      }
    )
  }
}
