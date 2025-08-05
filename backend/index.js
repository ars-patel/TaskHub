import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import DBconnection from "./utils/db.js";
import routes from "./routes/index.js"
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan("dev"));
app.use(express.json());

DBconnection();

const PORT = process.env.PORT;

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Welcome to TaskHub",
  });
});

// http://localhost:5000/api/v1
app.use("/api/v1", routes)

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    message: "Internal Server error",
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Not Found",
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
