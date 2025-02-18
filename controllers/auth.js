import { User } from "../models/index.js";
import bscrypt from "bcryptjs";

async function register(req, res) {
    try {
        const { email, password } = req.body;

        const user = new User({
            email: email.toLowerCase(),
        });

        // Encriptar la contraseña
        const salt = await bscrypt.genSalt(10);
        const passwordHash = await bscrypt.hash(password, salt);
        user.password = passwordHash;

        // Guardar el usuario usando await
        const userStorage = await user.save();
        
        // Si todo sale bien, enviar un mensaje al cliente
        res.status(201).send(userStorage);
    } catch (error) {
        res.status(400).send({ msg: "Error al registrar al usuario", error: error.message });
    }
}


export const AuthController = {
    register,
};
