import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsPersonFillCheck, BsPersonX } from "react-icons/bs";
import ImageMessage from "./ImageMessage";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "@/components/common/MessageStatus";
import { addOrRejectUser, setCurrentChatUser } from "@/features/user/userSlice";

function ChatContainer() {
  const dispatch = useDispatch();
  const { userInfo, currentChatUser } = useSelector(
    (state) => state.userReducer
  );
  const { messages } = useSelector((state) => state.chatReducer);

  const chatContainerRef = useRef(null);

  // useEffect(() => {
  //   chatContainerRef.current.scrollIntoView(false);
  // }, [messages]);

  const requestHandler = (decision) => {
    dispatch(
      setCurrentChatUser({ ...currentChatUser, pendingRequest: !decision })
    );
    if (decision) {
      // request accepted
      dispatch(
        addOrRejectUser({
          approverId: userInfo.id,
          isAccepted: decision,
          requesterId: currentChatUser.id,
        })
      );
    } else {
      // request rejected
      dispatch(
        addOrRejectUser({
          approverId: userInfo.id,
          isAccepted: decision,
          requesterId: currentChatUser.id,
          requestSentTo: userInfo.requestSentTo,
        })
      );
    }
  };

  return (
    <div className="bg-chat-background object-cover bg-fixed bg-no-repeat w-full relative flex-grow overflow-auto custom-scrollbar scroll-smooth">
      <div className="h-full w-full opacity-1 absolute pt-4">
        <div className="flex w-full overflow-auto">
          <div
            className="flex flex-col justify-end w-full gap-1 overflow-auto mx-10 pb-2"
            ref={chatContainerRef}
          >
            {currentChatUser.pendingRequest ? (
              <div className="absolute w-[90%] bottom-2 flex justify-between items-center gap-10 bg-slate-800 rounded-md text-white p-2">
                <div>This is a friend Request</div>

                <div className="flex gap-2">
                  <button
                    className="bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-full p-2 border-[1px] border-slate-700"
                    onClick={() => requestHandler(true)}
                  >
                    <span className="flex gap-1">
                      <BsPersonFillCheck fill="lightgreen" size={20} />
                      <span>Confirm Request</span>
                    </span>
                  </button>
                  <button
                    className="bg-gray-800 hover:bg-slate-700 text-white text-sm rounded-full p-2 border-[1px] border-slate-700"
                    onClick={() => requestHandler(false)}
                  >
                    <span className="flex gap-1">
                      <BsPersonX fill="red" size={20} />
                      <span>Reject Request</span>
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {messages?.map((message) => (
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
                        <span className="break-all">{message.content}</span>
                        <div className="flex flex-row gap-1 items-end relative">
                          <span className="block text-bubble-meta text-[10px] pt-1 min-w-fit">
                            {calculateTime(message?.sent_at)}
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
                    {message?.type === "image" && (
                      <ImageMessage message={message} />
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
