import express from "express";
import http from "http";
import { initSocketServer } from "./utils/index.js";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import { authRoutes } from "./routes/index.js";

const app = express();
const server = http.createServer(app);

initSocketServer(server);

// Configurar Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar Carpeta Estática
app.use(express.static("uploads"));

// Configurar CORS
app.use(cors());

// Configurar Logger HTTP Request
app.use(morgan("dev"));

// Configure routings
app.use("/api", authRoutes);

export { server };