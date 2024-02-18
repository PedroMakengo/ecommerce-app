import { Router } from 'express'
import authMiddleware from '../middlewares/auth'
import { errorHandler } from '../error-handler'
import {
  cancelOrder,
  changeStatus,
  createOrder,
  getOrderById,
  listAllOrders,
  listOrders,
  listUserOrders,
} from '../controllers/orders'

export const ordersRoutes = Router()

createOrder
ordersRoutes.post('/', [authMiddleware], createOrder)
ordersRoutes.get('/', [authMiddleware], errorHandler(listOrders))
ordersRoutes.put('/:id/cancel', [authMiddleware], errorHandler(cancelOrder))
ordersRoutes.get('/index', [authMiddleware], errorHandler(listAllOrders))
ordersRoutes.get('/users/:id', [authMiddleware], errorHandler(listUserOrders))
ordersRoutes.put('/status/:id', [authMiddleware], errorHandler(changeStatus))
ordersRoutes.get('/:id', [authMiddleware], errorHandler(getOrderById))
