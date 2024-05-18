import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { initDb } from "./config";
const route = require('./routes/index');

dotenv.config();
const app = express();
const port = 5000; 
app.use(express.json());
app.use(cors());
app.use(cookieParser());
route(app);

initDb();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
