import express, { Express, Request, Response } from 'express'
import { PORT } from './secrets'
import rootRouter from './routes'
import { PrismaClient } from '@prisma/client'
import { errorMiddleware } from './middlewares/errors'

const app: Express = express()

app.use(express.json())

// Minhas rotas
app.use('/api', rootRouter)

// Usando o meu prisma
export const prismaClient = new PrismaClient({
  log: ['query'],
}).$extends({
  result: {
    address: {
      formattedAddress: {
        needs: {
          lineOne: true,
          lineTwo: true,
          city: true,
          country: true,
          pincode: true,
        },
        compute: (addr) => {
          return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pincode}`
        },
      },
    },
  },
})

// Middleware para verificar os erros
app.use(errorMiddleware)

app.listen(PORT, () => console.log('Server running to port 3000'))
