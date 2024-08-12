import { useSelector } from "react-redux";
import Conversation from "./Conversation";
import { checkOnlineStatus, getConversationId } from "../../../utils/chat";

const Conversations = ({ onlineUsers }) => {
  const { conversations, activeConversation } = useSelector(
    (state) => state.chat
  );

  const { user } = useSelector((state) => state.user);
  return (
    <div className="convos scrollbar">
      <ul>
        {conversations &&
          conversations
            .filter((c) => c.latestMessage || c._id === activeConversation._id)
            //this will remove all the conversations with are empty as they wont have latest message property
            .map((convo) => {
              let check = checkOnlineStatus(onlineUsers, user, convo.users);
              return (
                <Conversation
                  convo={convo}
                  key={convo._id}
                  online={check ? true : false}
                />
              );
            })}
      </ul>
    </div>
  );
};

export default Conversations;
