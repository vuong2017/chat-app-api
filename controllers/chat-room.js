import ChatRoom from "../models/chat-room";
import mongoose from "mongoose";
import { handleError } from "../helpers";



const get = async (req, res) => {
  try {
    const rooms = await ChatRoom.aggregate([
      {$match:{users:mongoose.Types.ObjectId(req.body._id)}},
      {
        $lookup: {
          from: "chatmessages",
          localField: "_id",
          foreignField: "roomId",
          as: "messages"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          users: 1,
          type: 1,
          creator: 1,
          messages: 1,
          "unreadCount":{
            "$sum":{
              "$map":{
                "input":"$messages",
                "as":"messages",
                "in": {
                  "$cond":[{"$setIsSubset":[[mongoose.Types.ObjectId(req.body._id)], "$$messages.readBy"]},0,1]
                }
              }
            }
          },
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);;
    res.status(200).json({
      status: true,
      message: 'Get room success!',
      data: rooms
    })
  } catch (error) {
    handleError(res,error);
  }
};

const create = async (req, res) => {
  try {
    let { name, users = [], _id, type } = req.body;

    if(!name && users.length === 1) {
      name = [...users, _id].join(", ");
    }
    if(type === 'direct') {
      const checkRoomCreated = await ChatRoom.find({users: {$eq: [...users, _id]}});
      if(checkRoomCreated.length) {
        return res.status(403).json({
          status: false,
          errors: { message: "Room exist" },
        })
      }
      const checkRoomCreated1 = await ChatRoom.find({users: {$eq: [_id, ...users]}});
      if(checkRoomCreated1.length) {
        return res.status(403).json({
          status: false,
          errors: { message: "Room exist" },
        })
      }
    }
    const createRoom = new ChatRoom({ name, users: [...users, _id], creator: _id, type });
    const data = await createRoom.save();
    const io = req.app.get('socketio');
    io.emit('getRoomCreate', data);
    res.status(200).json({
      status: true,
      message: 'Create room success!',
      data
    })
  } catch (error) {
    handleError(error, res);
  }
};

const update = async (req, res) => {
  try {
    let { users = [] } = req.body;
    let { roomId } = req.params;
    console.log(roomId);
    const data = await ChatRoom.updateOne({ _id: roomId }, { $set: { users } })
    const io = req.app.get('socketio');
    io.emit('getRoomCreate', data);
    res.status(200).json({
      status: true,
      message: 'Create room success!',
      data
    })
  } catch (error) {
    handleError(error, res);
  }
};

export default {
  get,
  create,
  update
};
