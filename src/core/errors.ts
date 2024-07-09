export class AppBaseHttpError extends Error {
  public status: number
  public message: string

  constructor (status: number = 500, message: string = 'unexpected error') {
    super(message)
    this.status = status
    this.message = message
  }
}

export class ResourceNotFoundError extends AppBaseHttpError {
  constructor (subject: string) {
    super(404, `${subject} not found`)
  }
}

export class DuplicationRecordError extends AppBaseHttpError {
  constructor (subject: string) {
    super(409, `${subject} duplicated`)
  }
}

export class RequestValidationFailedError extends AppBaseHttpError {
  constructor (message: string = 'Request validation failed') {
    super(422, message)
  }
}

export class AuthenticationFailedError extends AppBaseHttpError {
  constructor (status_code:number,msg: string = 'Authentication failed') {
    super(status_code, msg)
  }
}
