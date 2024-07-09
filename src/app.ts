import express from 'express'
import { userRouter } from './apps'
import { appErrorHandlerMiddleware } from './core/middlewares'

const port = 3000

const app = express()
app.use(express.json())

app.listen(port, () => {
  if (port === 3000) {
    console.log(`Successfully connected to port ${port}!`)
  }
  console.log(`server is listening on ${port} !!!`)
})

app.use('', userRouter)

app.use('/health-check',(req, res) => res.json({message:'Hello World'}))

app.use(appErrorHandlerMiddleware)


export default app
