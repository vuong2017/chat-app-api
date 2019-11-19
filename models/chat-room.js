import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

let ChatRoomSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required!"],
      unique: true,
      lowercase: true,
    },
    users: [Schema.Types.ObjectId],
    type: {
      type: String,
      required: [true, "type is required!"],
    },
    creator: { type: String, required: [true, "creator is required!"]},
    messages: [{ type: Schema.Types.ObjectId, ref: 'ChatMessage' }],
    unreadCount: { type: String, default: 0 }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

ChatRoomSchema.plugin(uniqueValidator);

export default mongoose.model("ChatRoom", ChatRoomSchema);
