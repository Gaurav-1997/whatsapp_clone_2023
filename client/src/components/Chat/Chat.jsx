import React from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import MessageBar from "./MessageBar";
import { useSelector, useDispatch } from "react-redux";
import { pusherClient } from "@/utils/PusherClient";
import { addMessage, setChatReaction, setEditedMessage } from "@/features/chat/chatSlice";
import { setLastMessageInfo } from "@/features/user/userSlice";
function Chat() {
  const { chatId } = useSelector((reduxState) => reduxState.chatReducer);
  const { userInfo ,currentChatUser } = useSelector((reduxState) => reduxState.userReducer);
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    pusherClient.subscribe(chatId);
    pusherClient.bind("message:sent", handleRecievedMessage);
    pusherClient.bind("private-message:reaction", handleChatReaction);
    pusherClient.bind("private-message:edited", handleEditedChat);
    
    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("message:sent", handleRecievedMessage);
      pusherClient.unbind("private-message:reaction", handleChatReaction);
      pusherClient.unbind("private-message:edited", handleEditedChat);
    };
  }, [chatId]);

  const handleRecievedMessage = (data) => {
    console.log("handleRecievedMessage", data);
    const { message, recieverId,senderId, unread_message_count = 0 } = data;
    console.log(recieverId,"," ,currentChatUser.id, ",",userInfo.id)
    if(recieverId === userInfo.id){
      dispatch(
        addMessage({
          newMessage: { ...message }
        })
      );
      dispatch(setLastMessageInfo(data));
    }
    else{
      dispatch(setLastMessageInfo(data));
    }
  };

  const handleChatReaction = (data)=>{
    console.log("handleChatReaction:", data);
    if(data?.recieverId === userInfo?.id){
      dispatch(setChatReaction({...data}))
    } 
  }

  const handleEditedChat = (data) =>{
    console.log("handleEditedChat:", data);
    if(data?.recieverId === userInfo?.id){
      dispatch(setEditedMessage(data.editedMessage))
    }
  }
  return (
    <div className="border-conversation-border border-l bg-conversation-panel-background flex flex-col h-[100vh] z-10">
      <ChatHeader />
      <div className="h-full flex flex-col justify-between">
        <ChatContainer />
        <MessageBar />
      </div>
    </div>
  );
}

export default Chat;
