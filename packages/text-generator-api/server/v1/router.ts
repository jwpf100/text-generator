import express from 'express'

const v1Router = express.Router()

v1Router.get('/healthcheck', (req: unknown, res: { send: (arg0: string) => void }) => {
  console.log('v1 Router Healthcheck')
  res.send('Healthcheck OK')
})

export { v1Router }
