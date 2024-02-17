import { Router } from 'express'
import authMiddleware from '../middlewares/auth'
import { errorHandler } from '../error-handler'
import {
  cancelOrder,
  createOrder,
  getOrderById,
  listOrders,
} from '../controllers/orders'

export const ordersRoutes = Router()

ordersRoutes.post('/', [authMiddleware], errorHandler(createOrder))
ordersRoutes.get('/', [authMiddleware], errorHandler(listOrders))
ordersRoutes.delete('/:id', [authMiddleware], errorHandler(cancelOrder))
ordersRoutes.put('/:id', [authMiddleware], errorHandler(getOrderById))
