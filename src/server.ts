import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import http from 'http';
import { initDb } from "./config";
const route = require('./routes/index');
import io from './socket/connect'

dotenv.config();
const app = express();
const port = 5000;
const server = http.createServer(app); 
app.use(express.json());
app.use(morgan('combined'));
app.use(cors());
app.use(cookieParser());
route(app);
initDb();
io.listen(server)
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
