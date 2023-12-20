import { calculateTime } from "@/utils/CalculateTime";
import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MessageStatus from "@/components/common/MessageStatus";

function ChatContainer() {
  const messages = useSelector((state) => state.messages);
  console.log("new message1:", messages.length);
  const currentChatUser = useSelector((state) => state.currentChatUser);
  const userInfo = useSelector((state) => state.userInfo);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    console.log("new message2:", messages.length);
    chatContainerRef.current.scrollIntoView(false);
  }, [messages]);

  // console.log(messages[0]);
  return (
    <div className="bg-chat-background object-cover bg-fixed bg-no-repeat w-full relative flex-grow overflow-auto custom-scrollbar scroll-smooth">
      <div className="h-full w-full opacity-1 absolute pt-4">
        <div className="flex w-full overflow-auto">
          <div
            className="flex flex-col justify-end w-full gap-1 overflow-auto mx-10 pb-2"
            ref={chatContainerRef}
          >
            {messages?.map((message, idx) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === currentChatUser.id
                    ? "justify-start"
                    : "justify-end"
                } px-1 `}
              >
                {message.type === "text" && (
                  <div
                    className={`text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[70%]
                  ${
                    message.senderId === currentChatUser.id
                      ? "bg-incoming-background"
                      : "bg-outgoing-background"
                  }`}
                  >
                    <span className="break-all">{message.message}</span>
                    <div className="flex flex-row gap-1 items-end relative">
                      <span className="block text-bubble-meta text-[10px] pt-1 min-w-fit">
                        {calculateTime(message?.createdAt)}
                      </span>
                      <span className="block">
                        {message?.senderId === userInfo.id && (
                          <MessageStatus
                            messageStatus={message?.messageStatus}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
