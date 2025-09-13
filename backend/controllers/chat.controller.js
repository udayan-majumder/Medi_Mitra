import pool from "../db/db.js";
import { checkUserById } from "../models/user.models.js";

export const GetChatFunction = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "missing values in parameter" });
    }

    const userExists = checkUserById(id);
    if (!userExists) {
      return res.status(400).json({ message: "user does not exists" });
    }
    const fetchQuery = await pool.query(
      "SELECT * FROM chat_history WHERE user_id = $1",
      [id]
    );
    return res.status(200).json({ chat: fetchQuery.rows });
  } catch (e) {
    return res.status(500).json({ e });
  }
};

export const AddToChatHistory = async (req, res) => {
  try {
    const { id, sender, message } = req.body;
    if (!id || !sender || !message) {
      return res.status(400).json({ message: "missing values in parameter" });
    }

    const userExists = checkUserById(id);
    if (!userExists) {
      return res.status(400).json({ message: "user does not exists" });
    }

    const fetchQuery = await pool.query(
      "INSERT INTO chat_history (user_id, sender, message) VALUES ($1, $2, $3)",
      [id, sender, message]
    );
    return res.status(200).json({ message: "message added to chat history" });
  } catch (e) {
    console.error("Error adding to chat history:", e);
    return res.status(500).json({ e });
  }
};
