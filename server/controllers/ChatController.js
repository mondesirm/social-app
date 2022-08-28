import ChatModel from "../models/chatModel.js";
import MessageModel from "../models/messageModel.js";
import UserModel from "../models/userModel.js";

export const createChat = async (req, res) => {
  const newChat = new ChatModel({
    members: [req.body.senderId, req.body.receiverId],
  });

  const user = await UserModel.findById(req.body.senderId);
  const toUser = await UserModel.findById(req.body.receiverId);

  try {
    const oldChat = await ChatModel.findOne({ members: { $all: [req.body.senderId, req.body.receiverId] } });

    if (!user.following.includes(toUser._id) || !toUser.following.includes(user._id)) {
      return res.status(200).json({ message: "Must be friends" });
    }

    if (oldChat) return res.status(200).json({ message: "Chat already exists" });

    const chat = await newChat.save();
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const removeChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({ members: { $all: [req.body.senderId, req.body.receiverId] } });

    if (!chat) return res.status(200).json({ message: "Chat does not exist" });

    const messages = await MessageModel.find({ chatId: chat._id });
    
    await chat.remove();
    res.status(200).json("Chat removed");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json(error)
  }
};