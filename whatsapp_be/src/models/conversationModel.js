import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;


// IST Offset in milliseconds (UTC + 5:30)
const IST_OFFSET = 5.5 * 60 * 60 * 1000;


const conversationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Conversations name is required."],
      trim: true,
    },
    picture: {
      type: String,
      required: true,
    },
    isGroup: {
      type: Boolean,
      required: true,
      default: false,
    },
    users: [
      {
        type: ObjectId,
        ref: "UserModel",
      },
    ],
    latestMessage: {
      type: ObjectId,
      ref: "MessageModel",
    },
    admin: {
      type: ObjectId,
      ref: "UserModel",
    },
  },
  {
    collection: "conversations",
    timestamps: true,
  }
);

// Middleware to adjust timestamps to IST before saving
conversationSchema.pre("save", function (next) {
  const now = new Date();
  const nowIST = new Date(now.getTime() + IST_OFFSET);

  if (!this.createdAt) {
    this.createdAt = nowIST;
  }
  this.updatedAt = nowIST;
  
  next();
});

const ConversationModel =
  mongoose.models.ConversationModel ||
  mongoose.model("ConversationModel", conversationSchema);

export default ConversationModel;
