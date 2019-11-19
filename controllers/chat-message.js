import ChatMessage from "../models/chat-message";
import mongoose from "mongoose";
import { handleError } from "../helpers";

const getMessageRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await ChatMessage.aggregate([
      {$match:{roomId:mongoose.Types.ObjectId(roomId)}},
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          'user.username': 1,
          'user.email': 1,
          'user.createdAt': 1,
          'user._id': 1,
          message:1,
          roomId: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);
    res.status(200).json({
      status: true,
      message: 'Get messages success!',
      data: messages
    })
  } catch (error) {
    handleError(error, res);
  }
};

const create = async (req, res) => {
  try {
    const { message, _id, roomId } = req.body;
    const createMessage = new ChatMessage({ message, userId: _id, roomId, readBy: [_id] });
    const data = await createMessage.save();
    const io = req.app.get('socketio');
    const messages = await ChatMessage.aggregate([
      {$match:{_id:mongoose.Types.ObjectId(data._id)}},
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          'user.username': 1,
          'user.email': 1,
          'user.createdAt': 1,
          'user._id': 1,
          message:1,
          roomId: 1,
          userId:1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);
    io.emit('getMessageCreate', messages[0]);
    res.status(200).json({
      status: true,
      message: 'Create message success!',
      data: messages
    })
  } catch (error) {
    handleError(error, res);
  }
};

const updateReadMessageRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { _id } = req.body;
    const io = req.app.get('socketio');
    const message = await ChatMessage.updateMany({roomId}, {$addToSet: {readBy: _id}});
    io.emit('unReadMessage');
    res.status(200).json({
      status: true,
      message: 'Update message success!',
      data: message
    })
  } catch (error) {
    handleError(error, res);
  }
};

export default {
  getMessageRoom,
  create,
  updateReadMessageRoom,
};
