import React from "react";
import Avatar from "../common/Avatar";
import { useSelector, useDispatch } from "react-redux";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { setAllContactsPage } from "../../features/user/userSlice";
import preLoadIt from "@/preLoaded/preLoadIt";

function ChatListHeader() {
  const { userInfo, userLoading } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  preLoadIt();

  const handleAllContactsPage = () => {
    dispatch(setAllContactsPage());
  };

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer">
        {userLoading ? (
          <div className="shadow-black animate-pulse">
            <div className="h-10 w-10  bg-slate-700 rounded-full"></div>
          </div>
        ) : (
          <Avatar type="sm" image={userInfo?.profilePicture} />
        )}
      </div>
      {/* message icon */}

      {userLoading ? (
        <div className="animate-pulse flex gap-4 rounded-xl bg-gray-900/50 backdrop-blur-lg p-2 shadow-[inset_12px_12px_12px_rgba(56,6,256,0.1),inset_-10px_-10px_-10px_white]">
          <BsFillChatLeftTextFill
            className="text-panel-header-icon opacity-6 cursor-pointer text-xl"
            title="New Chat"
          />
          <HiOutlineStatusOnline
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Status"
          />
          <BsThreeDotsVertical
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Menu"
          />
        </div>
      ) : (
        <div className="flex gap-7 rounded-xl bg-gray-900/50 hover:border-t-2 border-gray-100/10 backdrop-blur-lg p-2 shadow-[inset_12px_12px_12px_rgba(56,6,256,0.1),inset_-10px_-10px_-10px_white]">
          <BsFillChatLeftTextFill
            className="text-panel-header-icon hover:text-[#83ffd4] transition-colors duration-300 delay-50 ease-in-out cursor-pointer text-xl"
            title="New Chat"
            onClick={handleAllContactsPage}
          />
          <HiOutlineStatusOnline
            className="text-panel-header-icon hover:text-[#83ffd4] transition-colors duration-300 delay-50 ease-in-out cursor-pointer text-xl"
            title="Status"
          />
          <BsThreeDotsVertical
            className="text-panel-header-icon hover:text-[#83ffd4] transition-colors duration-300 delay-50 ease-in-out cursor-pointer text-xl"
            title="Menu"
          />
        </div>
      )}
    </div>
  );
}

export default ChatListHeader;
