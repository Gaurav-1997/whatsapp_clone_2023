import React from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import MessageBar from "./MessageBar";

function Chat() {
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
