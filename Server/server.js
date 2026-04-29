import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import helmet from "helmet";

import { limiter } from "./middleware/rateLimiter.js";
import consultationRoutes from "./routes/consultation.js";
import subscribeRoutes from "./routes/subscribe.js";


const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(limiter);

app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

app.use("/api/consultation", consultationRoutes);
app.use("/api/subscribe", subscribeRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);

});
