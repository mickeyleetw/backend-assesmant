import { type Request as _Request } from 'express'

export interface Request extends _Request {
  validatedData?: any
}
