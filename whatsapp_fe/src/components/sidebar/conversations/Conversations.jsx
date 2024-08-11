import { useSelector } from "react-redux";
import Conversation from "./Conversation";

const Conversations = () => {
  const { conversations, activeConversation } = useSelector(
    (state) => state.chat
  );

  return (
    <div className="convos scrollbar">
      <ul>
        {conversations &&
          conversations
            .filter((c) => c.latestMessage || c._id === activeConversation._id)
            //this will remove all the conversations with are empty as they wont have latest message property
            .map((convo) => <Conversation convo={convo} key={convo._id} />)}
      </ul>
    </div>
  );
};

export default Conversations;
