let onlineUsers = [];
export default function (socket, io) {
  //user joins or opens the application
  socket.on("join", (user) => {
    socket.join(user);
    //add joined user to online users
    if (!onlineUsers.some((u) => u.userId === user)) {
      onlineUsers.push({ userId: user, socketId: socket.id });
    }
    //send online users to frontend
    io.emit("get-online-users", onlineUsers);
  });

  //socket Object: Represents the individual connection for the client that just connected. If the user refreshes the page or changes tabs, the socket object will change, but that doesn't necessarily mean the user is offline—they're just reconnecting with a new socket instance.

  //io Object: Represents the entire Socket.IO server and can broadcast to all connected clients.


  //socket disconnect
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    //Using io.emit ensures that the update is broadcasted to all clients, keeping everyone informed about the current state of online users.
    io.emit("get-online-users", onlineUsers);
  });

  //join a conversation room
  socket.on("join conversation", (conversation) => {
    socket.join(conversation);
  });

  //send and receive a message
  socket.on("send message", (message) => {
    console.log("new message received ->", message);
    let conversation = message.conversation;
    // If the conversation doesn't have users, exit the function
    if (!conversation.users) return;
    // each user in the conversation
    conversation.users.forEach((user) => {
      // Skip sending the message to the user who sent it
      if (user._id === message.sender._id) return;
      // Emit the "message received" event to all other users in the conversation
      socket.in(user._id).emit("receive message", message);
    });
  });
}


// Frontend (Client-Side) - socket.emit:
// Context: In the frontend, socket represents the WebSocket connection specific to the current client (user).
// Usage:
// When you use socket.emit in the frontend, you're sending an event or data from this specific client to the server.
// Since each client has its own unique socket connection, using socket.emit ensures that the event is emitted only from this particular client.
// Backend (Server-Side) - io.emit vs socket.emit:
// socket.emit:

// Context: On the server-side, socket represents a single connection with a specific client.
// Usage:
// If you use socket.emit on the server, you're sending a message back to the specific client associated with that socket. This is useful for sending private messages or responses to specific clients.
// io.emit:

// Context: io represents the Socket.IO server instance, which manages all connected clients.
// Usage:
// When you use io.emit, you're broadcasting an event to all connected clients. This is useful when you want to send a message to every client, like updating all users with the current list of online users.

// Why Not io.emit in the Frontend?
// Scope: In the frontend, you don't have an io object like on the server. The frontend only interacts with its specific socket connection, so you use socket.emit to communicate with the server.
// Broadcasting: The io.emit is designed for the server to broadcast messages to all clients. Since the frontend is just one client, it wouldn't make sense to broadcast to all clients from a single client's context.
// Summary:
// Frontend: Use socket.emit to send messages from the specific client to the server.
// Backend: Use socket.emit to send messages to a specific client or io.emit to broadcast messages to all clients.