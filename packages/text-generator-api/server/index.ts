import * as dotenv from 'dotenv'
import express from 'express'
import { v1Router } from './v1/router'
import { initialiseDependencies } from './v1/dependencies'

dotenv.config()

const start = () => {
  const { PORT } = process.env

  const app = express()
  const baseRoute = '/api'

  app.use(`${baseRoute}/v1`, v1Router)

  initialiseDependencies(process.env)
  .then(() => {
    app.listen(PORT, function () {
      console.log(`listening on port:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Error initialising dependencies: ', error)
  })
}

export default start
