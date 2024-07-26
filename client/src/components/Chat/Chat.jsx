import React from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import MessageBar from "./MessageBar";
import { useSelector, useDispatch } from "react-redux";
import { pusherClient } from "@/utils/PusherClient";
import { addMessage, setChatReaction, setEditedMessage, setMsgDeletedForEveryone, messageDelete } from "@/features/chat/chatSlice";
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
    pusherClient.bind("private-message:deletedForEveryOne", handleDeletedForEveryOne);
    pusherClient.bind("private-message:delete", handleMessageDelete);
    
    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("message:sent", handleRecievedMessage);
      pusherClient.unbind("private-message:reaction", handleChatReaction);
      pusherClient.unbind("private-message:edited", handleEditedChat);
      pusherClient.unbind("private-message:deletedForEveryOne", handleDeletedForEveryOne);      
      pusherClient.unbind("private-message:delete", handleMessageDelete);      
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
    if(data?.recieverId === userInfo?.id){
      dispatch(setEditedMessage(data.editedMessage))
    }
  }

  const handleDeletedForEveryOne = (data)=>{
    if(data?.recieverId === userInfo?.id){
      dispatch(setMsgDeletedForEveryone(data))
    }
  }
  
  const handleMessageDelete =(data)=>{
    console.log("handleMessageDelete", data)
    if(Number(data?.recieverId) === userInfo?.id){
      dispatch(messageDelete(data))
    }
  }
  return (
    <div className="border-conversation-border border-l bg-conversation-panel-background flex flex-col h-[100vh] z-10">
      <ChatHeader />
      <div className="h-full flex flex-col justify-between rounded-r-lg">
        <ChatContainer />
        <MessageBar />
      </div>
    </div>
  );
}

export default Chat;
