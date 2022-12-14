import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'
import config from "../config/config"
import Template from './../template'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors())


mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri).catch(error => console.log(error));


app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ "error": err.name + ": " + err.message })
    } else if (err) {
        res.status(400).json({ "error": err.name + ": " + err.message })
        console.log(err)
    }
})

app.get('/', (req, res) => {
    console.log("get...")
    res.status(200).send(Template())
})

app.use('/', userRoutes)

app.use('/', authRoutes)



app.listen(config.port, () => {
    console.log(`app listening on port ${config.port}`)
})

export default app