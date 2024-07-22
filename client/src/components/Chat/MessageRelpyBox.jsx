import React from "react";
import { useSelector } from "react-redux";

const MessageRelpyBox = ({message}) => {
    const { userInfo, currentChatUser } = useSelector(
        (state) => state.userReducer
      );
  return (
    <>
      <a
        className="flex text-white bg-slate-900 w-full rounded-md z-1 border-l-2 border-[#1cc9a9]"
        href={`#${message?.parentMessageId}`}
        target="_self"
      >
        {/* <div className="w-1 bg-stone-100 z-0"></div> */}
        <div className="flex flex-col m-1">
          <span className="text-[#1cc9a9] font-semibold">
            {Number(message?.repliedByUserId) === userInfo?.id
              ? "You"
              : currentChatUser?.name}
          </span>
          <span className="text-[#ffffff]">
            {message?.parentMessageContent}
          </span>
        </div>
      </a>
    </>
  );
};

export default MessageRelpyBox;
