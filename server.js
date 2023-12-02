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
import packagesRouter from './routes/packages.routes.js'
import movementsRouter from './routes/movements.routes.js'
import walletsRouter from './routes/wallets.routes.js'
import investmentsRouter from './routes/investments.routes.js'
app.use(indexRouter)
app.use('/auth/', authRouter)

// the following routes requires the user to be authenticated
import { isUserLogged } from "./middlewares/login-md.js"
app.use(isUserLogged)

app.use('/users/', usersRouter)
app.use('/clients/', clientsRouter)
app.use('/admins/', adminsRouter)
app.use('/packages/', packagesRouter)
app.use('/movements', movementsRouter)
app.use('/wallets', walletsRouter)
app.use('/investments', investmentsRouter)

// Set server to port
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})
