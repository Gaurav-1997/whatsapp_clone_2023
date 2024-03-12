import React from "react";
import Avatar from "../common/Avatar";
import { useDispatch } from "react-redux";
import {
  setAllContactsPage,
  setCurrentChatUser,
} from "@/features/user/userSlice";

function ChatLIstItem({ data, isContactPage}) {
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
        <Avatar type="lg" image={data?.profilePicture} />
      </div>
      <div className="min-w-full flex flex-col justify-center mt-3 pr-2 w-full ">
        <div className="flex justify-between">
          <div>
            <span className="text-white text-lg">{data?.name}</span>
          </div>
        </div>
            <button className="add-friend text-white text-sm ">Add friend</button>
        <div className="flex border-b border-conversation-border pb-2 pt-1 p3-2">
          <div className="flex justify-between w-full">
            <span className="text-secondary text-sm line-clamp-1">
              {data?.about || "\u00A0"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatLIstItem;
