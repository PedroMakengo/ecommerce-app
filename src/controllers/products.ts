import { Request, Response } from 'express'
import { prismaClient } from '../index'

export const createProduct = async (request: Request, response: Response) => {
  const product = await prismaClient.product.create({
    data: {
      ...request.body,
      tags: request.body.tags.join('.'),
    },
  })
  response.json(product)
}
