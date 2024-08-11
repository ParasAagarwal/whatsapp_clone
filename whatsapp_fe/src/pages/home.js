import { Sidebar } from "../components/sidebar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversations } from "../features/chatSlice";
import { ChatContainer, WhatsappHome } from "../components/Chat";
import SocketContext from "../context/SocketContext";

function Home({ socket }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  //join the user into the socket io
  //we use emit when we want to send some thing and on when we want to act on something to receive
  useEffect(()=>{
    socket.emit('join',user._id)
  },[user])

  //get conversations
  useEffect(() => {
    if (user?.token) {
      dispatch(getConversations(user.token));
    }
  }, [user]);

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      {/* Container */}
      <div className="container h-screen flex py-[19px]">
        {/* Sidebar */}
        <Sidebar />
        {activeConversation._id ? <ChatContainer /> : <WhatsappHome />}
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
