import React, { useEffect } from "react";
import Avatar from "../common/Avatar";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setSearchMessage } from "@/features/chat/chatSlice";
import { getUserStatus } from "@/features/user/userSlice";

function ChatHeader() {
  const { currentChatUser, currentChatUserStatus, onlineUsers } = useSelector(
    (state) => state.userReducer
  );
  const dispatch = useDispatch();
  const [userStatus, setUserStatus] = React.useState(false);

  useEffect(() => {
    dispatch(getUserStatus(currentChatUser?.id));
    console.log(currentChatUser.id, currentChatUserStatus);
    setUserStatus(onlineUsers.includes(currentChatUser?.id));
    console.log("onlineUsers", onlineUsers);
  }, [onlineUsers]);

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div
        className="flex items-center gap-6 relative"
        title={`${currentChatUserStatus ? "online" : "offline"}`}
      >
        <Avatar type="sm" image={currentChatUser?.profilePicture} />
        <div className="flex flex-col">
          <span className="text-primary-strong">{currentChatUser?.name}</span>
          {currentChatUserStatus ? (
            <span className="absolute h-3 w-3 rounded-lg bg-green-500 left-7 bottom-0 border-2 border-green-100"></span>
          ) : (
            <span className="absolute h-3 w-3 rounded-lg bg-gray-400 left-7 bottom-0 border-2 border-gray-100"></span>
          )}
        </div>
      </div>
      <div className="flex gap-6">
        <MdCall className="text-panel-header-icon cursor-pointer text-xl" />
        <IoVideocam className="text-panel-header-icon cursor-pointer text-xl" />
        <BiSearchAlt2
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={() => dispatch(setSearchMessage())}
        />
        <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl" />
      </div>
    </div>
  );
}

export default ChatHeader;
