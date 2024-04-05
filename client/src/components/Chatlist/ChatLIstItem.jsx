import React from "react";
import Avatar from "../common/Avatar";
import { useDispatch } from "react-redux";
import {
  setAllContactsPage,
  setCurrentChatUser,
} from "@/features/user/userSlice";

function ChatListItem({ data, isContactPage }) {
  const dispatch = useDispatch();

  const handleContactClick = () => {
    dispatch(setCurrentChatUser(data));
    // close the contactList Page
    dispatch(setAllContactsPage());
  };
  return (
    <div
      className={`flex cursor-pointer items-center hover:bg-background-default-hover rounded-lg `}
      onClick={handleContactClick}
    >
      <div className="min-w-fit px-5 pt-3 pb-1">
        <Avatar type="sm" image={data?.profilePicture} />
      </div>
      <div className="min-w-full flex flex-col justify-center mt-3 pr-2 ">
        <div className="flex justify-between">
          <div>
            <span className="text-white text-lg">{data?.name}</span>
          </div>
        </div>
        <div className="flex border-b border-conversation-border pb-2 pt-1">
          <div className="flex justify-between">
            <div className="text-secondary text-sm line-clamp-1">
              {data?.about || "\u00A0"}
            </div>
            <div className="right-0">
              <button className="add-friend text-cyan text-xs p-2 rounded-lg backdrop-blur-md bg-green-900 shadow-sm">Add friend</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatListItem;
