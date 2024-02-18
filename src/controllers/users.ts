import { Request, Response, NextFunction } from 'express'
import { prismaClient } from '../index'
import { AddressSchema, UpdateUserSchema } from '../schema/users'
import { NotFoundException } from '../exceptions/not-found'
import { ErrorCode } from '../exceptions/root'
import { Address, User } from '@prisma/client'
import { BadRequestsException } from '../exceptions/bad-requests'

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

export const updateUser = async (request: Request, response: Response) => {
  const validatedData = UpdateUserSchema.parse(request.body)
  var shippingAddress: Address
  var billingAddress: Address

  if (validatedData.defaultShippingAddress) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultShippingAddress,
        },
      })

      if (shippingAddress.userId !== request.user?.id) {
        throw new BadRequestsException(
          'Address does not belong user',
          ErrorCode.ADDRESS_DOES_NOT_BELONG
        )
      }
    } catch (error) {
      throw new NotFoundException(
        'Address not found',
        ErrorCode.ADDRESS_NOT_FOUND
      )
    }
  }

  if (validatedData.defaultBillingAddress) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultBillingAddress,
        },
      })

      if (billingAddress.userId !== request.user?.id) {
        throw new BadRequestsException(
          'Address does not belong user',
          ErrorCode.ADDRESS_DOES_NOT_BELONG
        )
      }
    } catch (error) {
      throw new NotFoundException(
        'Address not found',
        ErrorCode.ADDRESS_NOT_FOUND
      )
    }
  }

  const updateUser = await prismaClient.user.update({
    where: { id: request.user?.id },
    data: validatedData,
  })

  response.json(updateUser)
}

export const listUsers = async (request: Request, response: Response) => {}

export const getUserById = async (request: Request, response: Response) => {}

export const changeUserRole = async (request: Request, response: Response) => {}
