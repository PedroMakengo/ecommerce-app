import { NextFunction, Request, Response } from 'express'
import { prismaClient } from '../index'
import { hashSync, compareSync } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../secrets'
import { BadRequestsException } from '../exceptions/bad-requests'
import { ErrorCode } from '../exceptions/root'
import { UnprocessableEntity } from '../exceptions/validation'
import { SignupSchema } from '../schema/users'

// Criando um usuário
export const signup = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    SignupSchema.parse(request.body)
    const { email, password, name } = request.body

    let user = await prismaClient.user.findFirst({ where: { email } })

    if (user) {
      next(
        new BadRequestsException(
          'User already exists!',
          ErrorCode.USER_ALREADY_EXISTS
        )
      )
    }

    user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    })

    response.json(user)
  } catch (error: any) {
    next(
      new UnprocessableEntity(
        error?.issues,
        'Unprocessable entity',
        ErrorCode.UNPROCESSABLE_ENTITY
      )
    )
  }
}

// Login
export const login = async (request: Request, response: Response) => {
  const { email, password } = request.body

  let user = await prismaClient.user.findFirst({ where: { email } })

  if (!user) {
    throw Error('User does not exits!')
  }

  if (!compareSync(password, user.password)) {
    throw Error('Incorrect password!')
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  )
  response.json({ user, token })
}
