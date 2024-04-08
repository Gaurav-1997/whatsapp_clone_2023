import React from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import MessageBar from "./MessageBar";
import { useSelector, useDispatch } from "react-redux";
import { pusherClient } from "@/utils/PusherClient";
import { addMessage } from "@/features/chat/chatSlice";

function Chat() {
  const { chatId } = useSelector(reduxState => reduxState.chatReducer);
  const dispatch = useDispatch();

  React.useEffect(() => {
    pusherClient.subscribe(chatId);

    const doSomething = async (data) => {
      console.log("pusherClient", data);
      // alert(data.message);
      dispatch(addMessage({ newMessage: { ...data.message } }))
    };
    pusherClient.bind("message:sent", doSomething);

    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("message:sent", doSomething);
    };
  }, [chatId]);

  return (
    <div className="border-conversation-border border-l bg-conversation-panel-background flex flex-col h-[100vh] z-10">
      <ChatHeader />
      <div className="h-full flex flex-col justify-between">

      <ChatContainer/>
      <MessageBar/>
      </div>
    </div>
  );
}

export default Chat;
