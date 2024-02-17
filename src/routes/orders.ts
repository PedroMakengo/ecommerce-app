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

createOrder
ordersRoutes.post('/', [authMiddleware], createOrder)
ordersRoutes.get('/', [authMiddleware], errorHandler(listOrders))
ordersRoutes.put('/:id/cancel', [authMiddleware], errorHandler(cancelOrder))
ordersRoutes.get('/:id', [authMiddleware], errorHandler(getOrderById))
