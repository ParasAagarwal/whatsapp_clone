let onlineUsers = [];
export default function (socket, io) {
  //user joins or opens the application
  socket.on("join", (user) => {
    socket.join(user);
  });

  //join a conversation room
  socket.on("join conversation", (conversation) => {
    socket.join(conversation);
  });

  //send and receive a message
  socket.on("send message", (message) => {
    console.log("new message received ->",message)
    let conversation = message.conversation;
    // If the conversation doesn't have users, exit the function
    if (!conversation.users) return;
    // each user in the conversation
    conversation.users.forEach((user) => {
      // Skip sending the message to the user who sent it
      if (user._id === message.sender._id) return;
      // Emit the "message received" event to all other users in the conversation
      socket.in(user._id).emit("message received", message);
    });
  });
}
