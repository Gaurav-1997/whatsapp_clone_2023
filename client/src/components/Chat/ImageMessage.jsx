import { HOST } from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import React from "react";
import { useSelector } from "react-redux";
import MessageStatus from "../common/MessageStatus";

function ImageMessage({ message }) {
  // console.log(message)
  const { userInfo, currentChatUser } = useSelector(reduxState => reduxState.userReducer);
  return <div className={`p-1 rounded-lg ${message.senderId === currentChatUser.id
    ? "bg-incoming-background" :
    "bg-outgoing-background"
    }`}>
    <div className="relative">
      <img
        src={`${HOST}/${message.message}`}
        className="rounded-lg"
        alt="asset"
        height={300}
        width={300}
      />
      <div className="flex justify-end gap-1 h-4">
        <span className="block text-bubble-meta text-[10px] pt-1 min-w-fit">
          {calculateTime(message?.createdAt)}
        </span>
        <span className="text-bubble-meta">
          {message?.senderId === userInfo.id && (
            <MessageStatus
              messageStatus={message?.messageStatus}
            />
          )}
        </span>
      </div>
    </div>
  </div>;
}

export default ImageMessage;
