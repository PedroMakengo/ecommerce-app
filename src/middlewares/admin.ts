import { NextFunction, Request, Response } from 'express'
import { UnauthorizedException } from '../exceptions/unauthorized'
import { ErrorCode } from '../exceptions/root'

const adminMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const user = request.user as any

  if (user.role === 'ADMIN') {
    next()
  } else {
    next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
  }
}

export default adminMiddleware
