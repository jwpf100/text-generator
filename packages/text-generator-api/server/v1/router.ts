import express, { Request, Response } from 'express'
import { llmController } from './dependencies'

const v1Router = express.Router()

v1Router.get('/healthcheck', (req: unknown, res: { send: (arg0: string) => void }) => {
  console.log('v1 Router Healthcheck')
  res.send('Healthcheck OK')
})

v1Router.post('/text-generator', async (req: Request, res: Response) => {
  try {
    // console.log('Request received: ', req.body)
    await llmController.getModelResponse(req, res)    
  } catch (error) {
    console.error(error)
  }
})

export { v1Router }
