import { Request, Response } from 'express'
import { prismaClient } from '../index'
import { hashSync, compareSync } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../secrets'
import { BadRequestsException } from '../exceptions/bad-requests'
import { ErrorCode } from '../exceptions/root'
import { SignupSchema } from '../schema/users'
import { NotFoundException } from '../exceptions/not-found'

// Criando um usuário
export const signup = async (request: Request, response: Response) => {
  // Validação do meu schema usando o zod
  SignupSchema.parse(request.body)
  const { email, password, name } = request.body

  let user = await prismaClient.user.findFirst({ where: { email } })

  if (user) {
    new BadRequestsException(
      'User already exists!',
      ErrorCode.USER_ALREADY_EXISTS
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
}

// Login
export const login = async (request: Request, response: Response) => {
  const { email, password } = request.body

  let user = await prismaClient.user.findFirst({ where: { email } })

  if (!user) {
    throw new NotFoundException(
      'User does not exits!',
      ErrorCode.USER_NOT_FOUND
    )
  }

  if (!compareSync(password, user.password)) {
    throw new BadRequestsException(
      'Incorrect password!',
      ErrorCode.INCORRECT_PASSWORD
    )
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  )
  response.json({ user, token })
}

// Me
export const me = async (request: Request, response: Response) => {
  response.json(request.user)
}
