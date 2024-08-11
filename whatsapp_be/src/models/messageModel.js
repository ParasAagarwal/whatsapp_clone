import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;


// IST Offset in milliseconds (UTC + 5:30)
const IST_OFFSET = 5.5 * 60 * 60 * 1000;

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: ObjectId,
      ref: "UserModel",
    },
    message: {
      type: String,
      trim: true,
    },
    conversation: {
      type: ObjectId,
      ref: "ConversationModel",
    },
    files: [],
  },
  {
    collection: "messages",
    timestamps: true,
  }
);

// Middleware to adjust timestamps to IST before saving
messageSchema.pre("save", function (next) {
  const now = new Date();
  const nowIST = new Date(now.getTime() + IST_OFFSET);

  if (!this.createdAt) {
    this.createdAt = nowIST;
  }
  this.updatedAt = nowIST;
  
  next();
});

const MessageModel =
  mongoose.models.MessageModel || mongoose.model("MessageModel", messageSchema);

export default MessageModel;
