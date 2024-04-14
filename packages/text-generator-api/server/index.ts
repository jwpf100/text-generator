import * as dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { v1Router } from './v1/router'
import { initialiseDependencies } from './v1/dependencies'

dotenv.config()

const start = () => {
  const { PORT: port, CLIENT_URL: clientUrl } = process.env

  const app = express()
  const baseRoute = '/api'

  app.use(express.text())

  app.use(
    bodyParser.json({
      limit: undefined
    })
  )

  app.use(cors({
    origin: clientUrl,
  }))

  app.use(`${baseRoute}/v1`, v1Router)

  initialiseDependencies(process.env)
  .then(() => {
    app.listen(port, function () {
      console.log(`listening on port:${port}`)
    })
  })
  .catch((error) => {
    console.error('Error initialising dependencies: ', error)
  })
}

export default start
