import React from "react";
import MessageStatus from "../common/MessageStatus";
import { useSelector } from "react-redux";

export const LastMessageInfo = (props) => {
  const { userInfo } = useSelector((redux) => redux.userReducer); 
  return (
    <div
      className="w-full flex justify-between items-center text-[12px] gap-1"
      id={`lmi-${props?.data.id}`}
    >
      <div className="flex flex-row">
        {/* MessageStatus will show on the user sender end only */}
        {props.data?.fromSelf && (
          <MessageStatus messageStatus={props?.data?.last_message_status} />
        )}
        <span className="text-ellipsis">{props?.data?.last_message}</span>
      </div>
      {/* unread msg count will show on the user reciever end only */}
      {!props.data?.fromSelf &&
        props?.data?.unread_message_count > 0 && (
          <div className="bg-[#359e35] px-[8px] py-[2px] rounded-full font-bold text-center inline-block text-[#fff] absolute left-[220px]">
            {props?.data?.unread_message_count}
          </div>
        )}
    </div>
  );
};
