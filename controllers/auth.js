import { User } from "../models/index.js";
import bscrypt from "bcryptjs";
import { jwt } from "../utils/jwt.js";

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

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const emailLowerCase = email.toLowerCase();

        const userStorage = await User.findOne({ email: emailLowerCase });
        if (!userStorage) {
            return res.status(400).send({ msg: "Usuario no encontrado" });
        }

        const isPasswordValid = await bscrypt.compare(password, userStorage.password);
        if (!isPasswordValid) {
            return res.status(400).send({ msg: "Contraseña incorrecta" });
        }

        // Crear los tokens
        res.status(200).send({
            access: jwt.createAccessToken(userStorage),
            refresh: jwt.createRefreshToken(userStorage),
        });

    } catch (error) {
        res.status(500).send({ msg: "Error del servidor", error: error.message });
    }
}

async function refreshAccessToken(req, res) {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).send({ msg: "Token requerido" });
        }

        const hasExpired = jwt.hasExpiredToken(refreshToken);
        if (hasExpired) {
            return res.status(400).send({ msg: "Token expirado" });
        }

        const { user_id } = jwt.decoded(refreshToken);

        // Ahora usamos await para encontrar el usuario sin callbacks
        const userStorage = await User.findById(user_id);
        if (!userStorage) {
            return res.status(400).send({ msg: "Usuario no encontrado" });
        }

        res.status(200).send({
            accessToken: jwt.createAccessToken(userStorage),
        });
    } catch (error) {
        res.status(500).send({ msg: "Error del servidor", error: error.message });
    }
}


export const AuthController = {
    register,
    login, 
    refreshAccessToken,
};
