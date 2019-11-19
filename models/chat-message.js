import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

let ChatMessageSchema = new Schema(
  {
    message: {
      type: String,
      required: [true, "message is required!"],
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    roomId: { type: Schema.Types.ObjectId, ref: 'ChatRoom' },
    readBy: { type: Array }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);


ChatMessageSchema.plugin(uniqueValidator);

export default mongoose.model("ChatMessage", ChatMessageSchema);
