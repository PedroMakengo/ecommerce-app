import express, { Express, Request, Response } from 'express'

const app: Express = express()

app.get('/', (request: Request, response: Response) => {
  response.send('Working')
})

app.listen(3000, () => console.log('Server running to port 3000'))
