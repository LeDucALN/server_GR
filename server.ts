// Import Express framework
import express from "express";
import { addUser, authenticate } from "./firebase";


// Tạo một ứng dụng Express
const app = express();
const port = 3000; // Cổng mà server sẽ lắng nghe
app.use(express.json());

// Bắt đầu server và lắng nghe các kết nối đến cổng được chỉ định

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await addUser(email, password);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authenticate(email, password);
    res.json(user);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
