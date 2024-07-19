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
  const { currentChatUser, currentChatUserStatus } = useSelector(
    (state) => state.userReducer
  );
  const dispatch = useDispatch();
  // const [userStatus, setUserStatus] = React.useState(false);

  // useEffect(() => {
  //   dispatch(getUserStatus(currentChatUser?.id));
  // }, []);

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
      <div className="flex gap-6 rounded-xl bg-gray-900/50 backdrop-blur-lg p-2 shadow-[inset_12px_12px_12px_rgba(56,6,256,0.1),inset_-10px_-10px_-10px_white]">
        <MdCall className="text-panel-header-icon cursor-pointer text-xl hover:text-[#83ffd4] transition-colors duration-300 delay-50 ease-in-out" />
        <IoVideocam className="text-panel-header-icon cursor-pointer text-xl hover:text-[#83ffd4] transition-colors duration-300 delay-50 ease-in-out" />
        <BiSearchAlt2
          className="text-panel-header-icon cursor-pointer text-xl hover:text-[#83ffd4] transition-colors duration-300 delay-50 ease-in-out"
          onClick={() => dispatch(setSearchMessage())}
        />
        <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl hover:text-[#83ffd4] transition-colors duration-300 delay-50 ease-in-out" />
      </div>
    </div>
  );
}

export default React.memo(ChatHeader);
