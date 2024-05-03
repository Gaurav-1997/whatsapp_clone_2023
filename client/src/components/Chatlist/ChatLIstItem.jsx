import React from "react";
import Avatar from "../common/Avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllContactsPage,
  setCurrentChatUser,
} from "@/features/user/userSlice";
import {
  sendFriendRequest,
  setUser,
  getUserStatus,
} from "@/features/user/userSlice";
import { pusherClient } from "@/utils/PusherClient";
import { BsFillPersonPlusFill } from "react-icons/bs";

function ChatListItem(props) {
  const {
    data,
    isContactPage,
    pendingRequest = false,
    blocked = false,
    bgColor,
  } = props;
  const { userInfo, contactsPage } = useSelector(
    (reduxState) => reduxState.userReducer
  );
  const { chatId } = useSelector((reduxState) => reduxState.chatReducer);
  const { currentChatUser } = useSelector((reduxState) => reduxState.userReducer);
  const dispatch = useDispatch();

  React.useEffect(() => {
    // console.log("friendRequestBtnRequired", friendRequestBtnRequired);
    pusherClient.subscribe(`channel-${chatId}`);
    pusherClient.bind("incoming-friend-request", frienRequestHandler);

    return () => {
      pusherClient.unsubscribe(`channel-${chatId}`);
      pusherClient.unbind("incoming-friend-request", frienRequestHandler);
    };
  }, [userInfo]);

  const checkIfContactExists = (contactId) => {
    if (userInfo.friends.filter((user) => user.id === contactId).length)
      return false;
    if (userInfo.blockedUsers.filter((user) => user.id === contactId).length)
      return false;
    if (userInfo.pendingRequest.filter((user) => user.id === contactId).length)
      return false;
    if (userInfo.requestSentTo.includes(contactId)) return false;
    console.log("checkIfContactExists", contactId, false);
    return true;
  };

  const handleContactClick = () => {
    // adding pending request to CurrentChatUser to display the accept & reject request
    const isGetPrivateChatId =
      userInfo.friends.filter((user) => user.id === data.id).length > 0;
    console.log("handleContactClick getPrivateChatId");
    dispatch(
      getUserStatus({
        isGetPrivateChatId,
        senderId: userInfo.id,
        recieverId: data.id,
      })
    );

    dispatch(setCurrentChatUser({ ...data, pendingRequest }));
    // close the contactList Page
    // dispatch(setAllContactsPage());
  };

  const frienRequestHandler = (data) => {
    if (data.requester.id !== userInfo?.id) {
      const { pendingRequest, ...rest } = userInfo;
      const currPendingRequest = [data.requester, ...pendingRequest];
      const updatedUserInfo = { ...rest, pendingRequest: currPendingRequest };
      dispatch(setUser(updatedUserInfo));
    }
  };

  const handleFriendRequest = async (event) => {
    // it was closing the contactsPage on friend requestClick so used event.stopPropagation()
    // close the contactList Page
    event.stopPropagation();
    console.log("handleFriendRequest");
    dispatch(sendFriendRequest({ from: userInfo.id, to: data.id }));
  };

  return (
    <div
      className={`flex cursor-pointer items-center bg-${bgColor} hover:bg-background-default-hover rounded-lg relative`}
      onClick={handleContactClick}
    >
      <div className="min-w-fit px-5 pt-3 pb-1">
        <Avatar type="sm" image={data?.profilePicture} />
      </div>
      <div className="min-w-full flex flex-col justify-center mt-3 pr-2 ">
        <div className="flex justify-between">
          <div>
            <span className={`${data?.id===currentChatUser?.id ? 'text-cyan-400 text-[1rem] inner-shadow-blue-500' : 'text-white text-[14px]'} `}>{data?.name}</span>
          </div>
        </div>
        <div className="flex border-b border-conversation-border pb-2 pt-1">
          <div className="flex justify-between">
            <div className="text-secondary text-sm line-clamp-1 truncate">
              {data?.about || "\u00A0"}
            </div>

            {contactsPage && checkIfContactExists(data?.id) && (
              <div className="absolute right-2 bottom-1">
                <button
                  className="add-friend text-cyan text-lg p-3 rounded-full backdrop-blur-md bg-green-900 shadow-sm z-20"
                  onClick={handleFriendRequest}
                  title="Send Friend Request"
                >
                  <BsFillPersonPlusFill fill="white" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatListItem;
