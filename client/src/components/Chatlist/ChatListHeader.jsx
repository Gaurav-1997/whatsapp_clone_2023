import React from "react";
import Avatar from "../common/Avatar";
import { useSelector, useDispatch } from "react-redux";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
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
        <div className="animate-pulse flex gap-6">
          <BsFillChatLeftTextFill
            className="text-panel-header-icon opacity-6 cursor-pointer text-xl"
            title="New Chat"
          />
          <BsThreeDotsVertical
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Menu"
          />
        </div>
      ) : (
        <div className="flex gap-6">
          <BsFillChatLeftTextFill
            className="text-panel-header-icon cursor-pointer text-xl"
            title="New Chat"
            onClick={handleAllContactsPage}
          />
          <BsThreeDotsVertical
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Menu"
          />
        </div>
      )}
    </div>
  );
}

export default ChatListHeader;
