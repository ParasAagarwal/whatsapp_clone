import { useState } from "react";
import SocketContext from "../../../context/SocketContext";
import { useSelector } from "react-redux";

function Input({ message, setMessage, textRef, socket }) {
  const { activeConversation } = useSelector((state) => state.chat);
  const [typing, setTyping] = useState(false);

  const onChangeHandler = (e) => {
    setMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit("typing", activeConversation._id);
    }
    //checking if stopped typing for about 1 sec
    let lastTypingTime = new Date().getTime();
    let timer = 1000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime; //after 1 sec we will check time difference
      if (timeDiff >= timer && typing) {
        //here checking if user was typing ,hence avoiding the case when he wasn't typing
        socket.emit("stop typing", activeConversation._id);
        setTyping(false);
      }
    }, timer); //runs after one sec
  };

  return (
    <div className="w-full">
      <input
        type="text"
        className="dark:bg-dark_hover_1 dark:text-dark_text_1 outline-none h-[45px] w-full flex-1 rounded-lg pl-4"
        placeholder="Type a message"
        value={message}
        onChange={onChangeHandler}
        ref={textRef}
      />
    </div>
  );
}

const InputWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Input {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default InputWithSocket;
