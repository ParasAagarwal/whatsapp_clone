import { Sidebar } from "../components/sidebar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversations,
  updateMessagesAndConversations,
} from "../features/chatSlice";
import { ChatContainer, WhatsappHome } from "../components/Chat";
import SocketContext from "../context/SocketContext";

function Home({ socket }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  const [ onlineUsers, setOnlineUsers ] = useState([]);
  //join the user into the socket io
  //we use emit when we want to send some thing and on when we want to act on something to receive
  useEffect(() => {
    socket.emit("join", user._id);
    //get online users
    //on is used to listen
    socket.on("get-online-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  //get conversations
  useEffect(() => {
    if (user?.token) {
      dispatch(getConversations(user.token));
    }
  }, [user]);

  //listening to receiving a message
  useEffect(() => {
    socket.on("receive message", (message) => {
      dispatch(updateMessagesAndConversations(message));
    });
  }, []);

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      {/* Container */}
      <div className="container h-screen flex py-[19px]">
        {/* Sidebar */}
        <Sidebar onlineUsers={onlineUsers} />
        {activeConversation._id ? (
          <ChatContainer onlineUsers={onlineUsers} />
        ) : (
          <WhatsappHome />
        )}
      </div>
    </div>
  );
}

// This higher-order component (HOC) wraps the Home component to provide it with
// the socket instance from the SocketContext. It uses an arrow function to pass
// the socket as a prop to the Home component, allowing the Home component to
// access and use the socket for real-time communication.
const HomeWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Home {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default HomeWithSocket;

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
