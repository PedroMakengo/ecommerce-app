import { NextFunction, Request, Response } from 'express'
import { UnauthorizedException } from '../exceptions/unauthorized'
import { ErrorCode } from '../exceptions/root'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../secrets'
import { prismaClient } from '..'
import { User } from '@prisma/client'

declare module 'express' {
  export interface Request {
    user?: User
  }
}

const authMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  //1. extract the token from header
  const token: string = request.headers.authorization as any
  //2. if token is not present, throw an of unauthorized
  if (!token) {
    next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
  }
  try {
    //3. if the token is present, verify that token and extract he payload
    const payload: { userId: number } = jwt.verify(token, JWT_SECRET) as any
    //4. to get the user from the payload
    const user: User = (await prismaClient.user.findFirst({
      where: { id: payload.userId },
    })) as any

    if (!user) {
      next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
    }
    //5. to attach the user to the current request object
    request.user = user
    next()
  } catch (error) {
    next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
  }
}

export default authMiddleware
