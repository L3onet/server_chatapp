import { Chat, ChatMessage } from "../models/index.js";

async function create(req, res) {
    try {
        const { participant_id_one, participant_id_two } = req.body;

        const foundOne = await Chat.findOne({
            participant_one: participant_id_one,
            participant_two: participant_id_two,
        });

        const foundTwo = await Chat.findOne({
            participant_one: participant_id_two,
            participant_two: participant_id_one,
        });

        if (foundOne || foundTwo) {
            return res.status(200).send({ msg: "Ya tienes un chat con este usuario" });
        }

        const chat = new Chat({
            participant_one: participant_id_one,
            participant_two: participant_id_two,
        });

        // Ahora usamos await para guardar el chat sin callbacks
        const chatStorage = await chat.save();
        res.status(201).send(chatStorage);
    } catch (error) {
        res.status(400).send({ msg: "Error al crear el chat", error: error.message });
    }
}

async function getAll(req, res) {
    try {
        const { user_id } = req.user;

        // Utilizamos await para ejecutar la consulta correctamente
        const chats = await Chat.find({
            $or: [{ participant_one: user_id }, { participant_two: user_id }],
        })
        .populate("participant_one")
        .populate("participant_two");

        if (!chats || chats.length === 0) {
            return res.status(400).send({ msg: "No se encontraron chats" });
        }

        const arrayChats = [];
        for await (const chat of chats) {
            const response = await ChatMessage.findOne({ chat: chat._id }).sort({
            createdAt: -1,
            });

            arrayChats.push({
                ...chat._doc,
                last_message_date: response?.createdAt || null,
            });
        }

        res.status(200).send(chats);
    } catch (error) {
        res.status(500).send({ msg: "Error del servidor", error: error.message });
    }
}

async function deleteChat(req, res) {
    try {
        const chat_id = req.params.id;

        // Ahora usamos await para eliminar el chat sin callbacks
        const deletedChat = await Chat.findByIdAndDelete(chat_id);

        if (!deletedChat) {
            return res.status(400).send({ msg: "No se encontró el chat a eliminar" });
        }

        res.status(200).send({ msg: "Chat eliminado" });
    } catch (error) {
        res.status(500).send({ msg: "Error del servidor", error: error.message });
    }
}

async function getChat(req, res) {
    try {
        const chat_id = req.params.id;

        const chatStorage = await Chat.findById(chat_id)
            .populate("participant_one")
            .populate("participant_two");

        if (!chatStorage) {
            return res.status(400).send({ msg: "No se encontró el chat" });
        }

        res.status(200).send(chatStorage);
    } catch (error) {
        res.status(500).send({ msg: "Error del servidor", error: error.message });
    }
}

export const ChatController = {
    create,
    getAll,
    deleteChat,
    getChat,
};
