// Initialize server and env variables
import express from "express";
import { config } from "dotenv";
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';

const app = express();
config();
const PORT = process.env.SERVER_PORT;
const server = http.createServer(app);

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

const io = new Server(server, {cors:corsOptions});
app.use(cors(corsOptions));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Set routes
import indexRouter from './routes/index.routes.js';
import authRouter from './routes/auth.routes.js';
import usersRouter from './routes/users.routes.js';
import clientsRouter from './routes/clients.routes.js';
import adminsRouter from './routes/admins.routes.js';
import packagesRouter from './routes/packages.routes.js';
import movementsRouter from './routes/movements.routes.js';
import walletsRouter from './routes/wallets.routes.js';
import investmentsRouter from './routes/investments.routes.js';


// app.use(indexRouter);
app.use('/auth/', authRouter);

// the following routes require the user to be authenticated
import { isUserLogged } from "./middlewares/login-md.js";
import { getAllClients } from "./controller/client-controller.js";
app.use(isUserLogged);

app.use('/users/', usersRouter);
app.use('/clients/', clientsRouter);
app.use('/admins/', adminsRouter);
app.use('/packages/', packagesRouter);
app.use('/movements', movementsRouter);
app.use('/wallets', walletsRouter);
app.use('/investments', investmentsRouter);

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(PORT, () => {
  const address = server.address();
  const protocol = server instanceof http.Server ? 'http' : 'https';
  const serverAddress = `${protocol}://localhost:${address.port}`;
  console.log(`Server is listening on ${serverAddress}`);
});