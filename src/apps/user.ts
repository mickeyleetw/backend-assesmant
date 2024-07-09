import { Router, type Response, type NextFunction } from 'express'
import { type Request } from '../core/express'

import { UserUseCase } from '../usecases'
import { UserSignUpSchema, UserLogInSchema, ResetPasswordSchema, JwtTokenSchema } from '../schemas'
import { validateAndTransformRequestDataMiddleware, authUserLoginMiddleware } from '../core/middlewares'
import { use } from 'chai'

export const router = Router()

// User Register
const userSignUpHandler = (userUseCase: UserUseCase): (request: Request, response: Response, next: NextFunction) => void => {
  return (request: Request, response: Response, next: NextFunction): void => {
    const data: UserSignUpSchema = request.validatedData

    userUseCase.createUser(data)
      .then(user => {
        response.status(201).json(user)
      })
      .catch(error => {
        next(error)
      })
  }
}
router.post('/register', (request, response, next) => {
  validateAndTransformRequestDataMiddleware(request, response, next, UserSignUpSchema)
}, userSignUpHandler(new UserUseCase()))

// User Log In
const userLogInHandler = (userUseCase: UserUseCase): (request: Request, response: Response, next: NextFunction) => void => {
  return (request: Request, response: Response, next: NextFunction): void => {
    const data: UserLogInSchema = request.validatedData

    userUseCase.userLogIn(data)
      .then(token => {
        response.status(200).json(token)
      })
      .catch(error => {
        next(error)
      })
  }
}
router.post('/login', (request, response, next) => {
  validateAndTransformRequestDataMiddleware(request, response, next, UserLogInSchema)
}, userLogInHandler(new UserUseCase()))

// Reset Password
const resetPasswordHandler = (userUseCase: UserUseCase): (request: Request, response: Response, next: NextFunction) => void => {
  return (request: Request, response: Response, next: NextFunction): void => {
    const data: ResetPasswordSchema = request.validatedData

    userUseCase.resetPassword(data)
      .then(() => {
        response.status(204).end()
      })
      .catch(error => {
        next(error)
      })
  }
}
router.post('/change-password', (request, response, next) => {
  authUserLoginMiddleware(request, response, next)
}, (request, response, next) => {
  validateAndTransformRequestDataMiddleware(request, response, next, ResetPasswordSchema)
}, resetPasswordHandler(new UserUseCase()))


// Validate Refresh Token and Issue New JWT Token
const refreshTokenHandler = (userUseCase: UserUseCase): (request: Request, response: Response, next: NextFunction) => void => {
  return (request: Request, response: Response, next: NextFunction): void => {
    const data: JwtTokenSchema = request.body.validatedData;
    userUseCase.validateRefreshToken(data)
      .then((token) => {
        response.status(200).json(token)
      })
      .catch((error) => {
        next(error)
      })
  }
}
router.post('/validate-refresh-token', (request, response, next) => {
  validateAndTransformRequestDataMiddleware(request, response, next, JwtTokenSchema);
}, refreshTokenHandler(new UserUseCase()))


// Dummy Data
const dummyDataHandle = (userUseCase: UserUseCase): (request: Request, response: Response,next: NextFunction) => void => {
  return (request: Request, response: Response,next: NextFunction): void => {
    // Verify JWT token
    const token = request.body.bearerJWT
    userUseCase.validateAccessToken(token).then((result)=>{
      if (result.status === 200||result.status === 202) {
        response.status(result.status).json(result.message)
      }
    })
    .catch((error) => {
      next(error)
    })
  }
}
router.get('/dummy-data',(req,res,next)=>{
  const token:any = req.headers.authorization?.replace('Bearer ', '')
  req.body = {bearerJWT: token}
  next()
}, dummyDataHandle(new UserUseCase()))