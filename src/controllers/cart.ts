import { Request, Response } from 'express'
import { prismaClient } from '../index'
import { CreateCartSchema } from '../schema/cart'
import { BadRequestsException } from '../exceptions/bad-requests'
import { ErrorCode } from '../exceptions/root'
import { NotFoundException } from '../exceptions/not-found'
import { Product } from '@prisma/client'

export const addItemToCart = async (request: Request, response: Response) => {
  // Check for the existence of the same product in user's cart and alter the quantity as requierd
  const validatedData = CreateCartSchema.parse(request.body)
  let product: Product

  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: { id: validatedData.productId },
    })
  } catch (error) {
    throw new NotFoundException(
      'Product not found',
      ErrorCode.PRODUCT_NOT_FOUND
    )
  }

  const cart = await prismaClient.cartItem.create({
    data: {
      userId: request.user?.id,
      productId: product.id,
      quantity: validatedData.quantity,
    } as any,
  })

  response.json(cart)
}

export const deleteItemFromCart = async (
  request: Request,
  response: Response
) => {
  // Check if user is deleting its own cart item
  await prismaClient.cartItem.delete({
    where: { id: Number(request.params.id) },
  })

  response.json({ success: true })
}

export const changeQuantity = async (request: Request, response: Response) => {}

export const getCart = async (request: Request, response: Response) => {
  const count = await prismaClient.cartItem.count()
  const cart = await prismaClient.cartItem.findMany({
    skip: Number(request.query.skip) || 0,
    take: 5,
  })

  response.json({ cart, count })
}
