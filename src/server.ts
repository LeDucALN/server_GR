import express from "express";
import dotenv from "dotenv";
import { initDb } from "./config";

dotenv.config();
const app = express();
const port = 3000; 
app.use(express.json());
initDb();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
