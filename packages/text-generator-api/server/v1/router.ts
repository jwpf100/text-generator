import express, { Request, Response } from 'express'
import { llmController } from './dependencies'
import OpenAI from 'openai'

const v1Router = express.Router()

v1Router.get('/healthcheck', (req: unknown, res: { send: (arg0: string) => void }) => {
  console.log('v1 Router Healthcheck')
  res.send('Healthcheck OK')
})

v1Router.post('/text-generator-example', async (req: Request, res: Response) => {
  const promise = await llmController.generateResponse()
  console.log("🚀 ~ v1Router.post ~ promise:", promise)
  res.send(promise)
})

v1Router.post('/text-generator-example-two', async (req: Request, res: Response) => {
  const openai = new OpenAI({ apiKey: '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' })
  try {
    console.log('Request received: ', req.body)

    const stream = openai.beta.chat.completions.stream({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [{ role: 'user', content: req.body}],
    })

    res.header('Content-Type', 'text/plain')
    for await (const chunk of stream.toReadableStream()) {
      console.log("🚀 ~ forawait ~ chunk:", chunk)
      res.write(chunk)
    }

    res.end()
  } catch (error) {
    console.error(error)
  }
})

v1Router.post('/text-generator', async (req: Request, res: Response) => {
  console.log("🚀 ~ v1Router.post ~ req:", req.body)
  try {
    // console.log('Request received: ', req.body)
    await llmController.getModelResponse(req, res)    
  } catch (error) {
    console.error(error)
  }
})

export { v1Router }
