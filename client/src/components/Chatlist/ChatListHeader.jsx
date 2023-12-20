import React from "react";
import Avatar from "../common/Avatar";
import { useSelector, useDispatch } from "react-redux";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { setAllContactsPage } from "../../features/user/userSlice";

function ChatListHeader() {
  const userInfo = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();

  const handleAllContactsPage = () => {
    dispatch(setAllContactsPage());
  };
  
  // console.log("ChatListHeader");
  // console.log(userInfo);
  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer">
        <Avatar type="sm" image={userInfo?.profilePicture} />
      </div>
      <div className="flex gap-6">
        {/* message icon */}
        <BsFillChatLeftTextFill
          className="text-panel-header-icon cursor-pointer text-xl"
          title="New Chat"
          onClick={handleAllContactsPage}
        />
        <>
          <BsThreeDotsVertical
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Menu"
          />
        </>
      </div>
    </div>
  );
}

export default ChatListHeader;
