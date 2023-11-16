// Initialize server and env variables
import express from "express"
import { config } from "dotenv"
const app = express()
config()
const PORT = process.env.SERVER_PORT

// Middlewares
import bodyParser from 'body-parser'
app.use(bodyParser.urlencoded({extended:true}))

// Set routes
import indexRouter from './routes/index.routes.js'
import authRouter from './routes/auth.routes.js'
import usersRouter from './routes/users.routes.js'
import clientsRouter from './routes/clients.routes.js'
import adminsRouter from './routes/admins.routes.js'
app.use(indexRouter)
app.use('/auth/', authRouter)
app.use('/users/', usersRouter)
app.use('/clients/', clientsRouter)
app.use('/admins/', adminsRouter)

// Set server to port
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})
// Check database connection
import db from "./db/db-connection.js"
db.getConnection( (err, connection) => {
    if(err) {
        console.error(err)
        return
    } else {
        console.log(`Database ${process.env.DB_NAME} connected on ${process.env.DB_HOST}:${process.env.DB_PORT}`)
    }
    connection.release()
} )