import { Router } from 'express'
import authMiddleware from '../middlewares/auth'
import { errorHandler } from '../error-handler'
import {
  addItemToCart,
  changeQuantity,
  deleteItemFromCart,
  getCart,
} from '../controllers/cart'

export const cartRoutes = Router()

cartRoutes.post('/', [authMiddleware], errorHandler(addItemToCart))
cartRoutes.get('/', [authMiddleware], errorHandler(getCart))
cartRoutes.delete('/:id', [authMiddleware], errorHandler(deleteItemFromCart))
cartRoutes.put('/:id', [authMiddleware], errorHandler(changeQuantity))
