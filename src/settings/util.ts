import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.SECRET_KEY ?? 'secret'

import { AuthenticationFailedError } from '../core/errors';


async function decodeJwtToken(token: string): Promise<{ userId: number, userName: string }> {
  try {
    if (!token || token === "") {
      throw new Error("JWT Token is required")
    }
    const decodedToken = jwt.verify(token, SECRET_KEY) as { userId: number, userName: string, exp: number };
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
      throw new Error("JWT Token has expired");
    }
    return decodedToken;
  } catch (error: any) {
    throw new AuthenticationFailedError(204,error.message)
  }
}

export { decodeJwtToken };