import { Request, Response } from 'express'
import { prismaClient } from '../index'
import { NotFoundException } from '../exceptions/not-found'
import { ErrorCode } from '../exceptions/root'
import { BadRequestsException } from '../exceptions/bad-requests'

// Create Product
export const createProduct = async (request: Request, response: Response) => {
  const product = await prismaClient.product.create({
    data: {
      ...request.body,
      tags: request.body.tags.join(','),
    },
  })
  response.json(product)
}

// Update Product
export const updateProduct = async (request: Request, response: Response) => {
  try {
    const product = request.body

    if (product.tags) {
      product.tags = product.tags.join(',')
    }

    const updateProduct = await prismaClient.product.update({
      where: { id: Number(request.params.id) },
      data: product,
    })

    response.json(updateProduct)
  } catch (error) {
    throw new NotFoundException(
      'Product Not Found',
      ErrorCode.PRODUCT_NOT_FOUND
    )
  }
}

// Delete Product
export const deleteProduct = async (request: Request, response: Response) => {
  const product = await prismaClient.product.delete({
    where: {
      id: Number(request.params.id),
    },
  })

  response.json(product)
  try {
  } catch (error) {
    throw new BadRequestsException('Not found', ErrorCode.PRODUCT_NOT_FOUND)
  }
}

// List Product
export const listProducts = async (request: Request, response: Response) => {
  const count = await prismaClient.product.count()
  const products = await prismaClient.product.findMany({
    skip: Number(request.query.skip) || 0,
    take: 5,
  })
  response.json({ count, products })
}

// Show Product
export const getProductById = async (request: Request, response: Response) => {
  const product = await prismaClient.product.findFirstOrThrow({
    where: { id: Number(request.params.id) },
  })

  response.json(product)
}

export const searchProducts = async (request: Request, response: Response) => {
  const products = await prismaClient.product.findMany({
    skip: Number(request.query.skip) || 0,
    take: 5,
    where: {
      name: {
        search: request.query.q?.toString(),
      },
      description: {
        search: request.query.q?.toString(),
      },
      tags: {
        search: request.query.q?.toString(),
      },
    },
  })

  // response.json(products)

  response.json(products)
}
