import express from "express";
import { AuthController } from "../controllers/index.js";
// import { mdAuth } from "../middlewares/index.js";

const api = express.Router();

api.post("/auth/register", AuthController.register);
api.post("/auth/login", AuthController.login);
api.post("/auth/refresh_access_token", AuthController.refreshAccessToken);

/*
api.get("/auth/me", [mdAuth.asureAuth], (req, res) => {
    console.log("Datos del usuario autenticado");
    console.log(req.user);

    console.log("#########");
    console.log("#########");
    console.log("#########");
    
    res.status(200).send({ msg: "Datos del usuario autenticado" });
});
*/


export const authRoutes = api;
