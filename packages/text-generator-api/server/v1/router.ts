import express, { Request, Response } from 'express'
import { llmController } from './dependencies'

const v1Router = express.Router()

v1Router.get('/healthcheck', (req: unknown, res: { send: (arg0: string) => void }) => {
  console.log('v1 Router Healthcheck')
  res.send('Healthcheck OK')
})

v1Router.post('/stream-text-generator', async (req: Request, res: Response) => {
  try {
    await llmController.getStreamedModelResponse(req, res)    
  } catch (error) {
    console.error(error)
  }
})

v1Router.post('/completion-text-generator', async (req: Request, res: Response) => {
  try {
    const response = await llmController.getStandardModelResponse(req)    
    res.send(response)
  } catch (error) {
    console.error(error)
  }
})

export { v1Router }
