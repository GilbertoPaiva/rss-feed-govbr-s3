import 'dotenv/config';
import express from "express";
import cors from 'cors';
import rssRoute from "../routes/rssRoutes.js";

const app = express();

app.use (cors());

app.use (express.static("public"));

app.use (express.json());

app.use ("/api", rssRoute);

export default app;