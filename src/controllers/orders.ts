import { Request, Response } from 'express'
import { prismaClient } from '../index'
import { NotFoundException } from '../exceptions/not-found'
import { ErrorCode } from '../exceptions/root'

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
      let totalPrice = current.quantity * Number(current.product.price)
      return prev + totalPrice
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
  const orders = await prismaClient.order.findMany({
    where: {
      userId: Number(request.user?.id),
    },
  })
  response.json(orders)
}

export const cancelOrder = async (request: Request, response: Response) => {
  try {
    const order = await prismaClient.order.update({
      where: { id: Number(request.params.id) },
      data: {
        status: 'CANCELLED',
      } as any,
    })

    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: 'CANCELLED',
      },
    })

    response.json(order)
  } catch (error) {
    throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND)
  }
}

export const getOrderById = async (request: Request, response: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: { id: Number(request.params.id) },
      include: {
        products: true,
        events: true,
      },
    })

    response.json(order)
  } catch (error) {
    throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND)
  }
}

export const listAllOrders = async (request: Request, response: Response) => {
  let whereClause = {}

  const status = request.params.status

  if (status) {
    whereClause = { status }
  }

  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: Number(request.query.skip) || 0,
    take: 5,
  })

  response.json(orders)
}

export const changeStatus = async (request: Request, response: Response) => {
  try {
    const order = await prismaClient.order.update({
      where: {
        id: Number(request.params.id),
      },
      data: {
        status: request.body.status,
      } as any,
    })

    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: request.body.status,
      },
    })

    response.json(order)
  } catch (error) {
    throw new NotFoundException('Not Found Order', ErrorCode.ORDER_NOT_FOUND)
  }
}

export const listUserOrders = async (request: Request, response: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        userId: Number(request.params.id),
        status: request.body.status,
      },
      include: {
        user: true,
      },
    })

    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: request.body.status,
      },
    })

    response.json(order)
  } catch (error) {
    throw new NotFoundException('Not exist user', ErrorCode.ORDER_NOT_FOUND)
  }
}
