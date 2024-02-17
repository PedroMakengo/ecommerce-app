import { Request, Response, NextFunction } from 'express'
import { prismaClient } from '../index'
import { AddressSchema } from '../schema/users'
import { NotFoundException } from '../exceptions/not-found'
import { ErrorCode } from '../exceptions/root'
import { User } from '@prisma/client'

export const addAddress = async (request: Request, response: Response) => {
  AddressSchema.parse(request.body)
  let user: User
  try {
    user = await prismaClient.user.findFirstOrThrow({
      where: { id: Number(request.body.userId) },
    })
  } catch (error) {
    throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND)
  }

  const address = await prismaClient.address.create({
    data: {
      ...request.body,
      userId: user.id,
    },
  })

  response.json(address)
}

export const deleteAddress = async (request: Request, response: Response) => {
  const address = await prismaClient.address.delete({
    where: { id: Number(request.params.id) },
  })
  response.json(address)
}

export const listAddress = async (request: Request, response: Response) => {
  const address = await prismaClient.address.findMany()
  response.json(address)
}
