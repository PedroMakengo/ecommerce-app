import { Request, Response } from 'express'

export const login = (request: Request, response: Response) => {
  response.send('Login works')
}
