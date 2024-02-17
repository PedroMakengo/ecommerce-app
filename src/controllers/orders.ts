import { Request, Response } from 'express'
import { prismaClient } from '../index'

export const createOrder = async (request: Request, response: Response) => {
  return await prismaClient.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        id: request.user?.id,
      },
      include: {
        product: true,
      },
    })

    if (cartItems.length === 0) {
      return response.json({ message: 'Cart is empty' })
    }

    const price = cartItems.reduce((prev, current) => {
      let result = current.quantity * Number(current.product.price)
      return prev + result
    }, 0)

    const address = await tx.address.findFirst({
      where: { id: request.user?.defaultShippingAddress } as any,
    })

    const order = await tx.order.create({
      data: {
        userId: request.user?.id,
        netAmount: price,
        address: address?.formattedAddress,
        products: {
          create: cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity,
            }
          }),
        },
      } as any,
    })

    const orderEvent = await tx.orderEvent.create({
      data: {
        orderId: order.id,
      },
    })

    await tx.cartItem.deleteMany({
      where: { userId: request.user?.id },
    })

    return response.json(order)
  })
}

export const listOrders = async (request: Request, response: Response) => {
  const orders = await prismaClient.order.findMany()
  response.json(orders)
}
export const cancelOrder = async (request: Request, response: Response) => {}

export const getOrderById = async (request: Request, response: Response) => {
  const orders = await prismaClient.order.findFirstOrThrow({
    where: { id: Number(request.params.id) },
  })

  response.json(orders)
}
