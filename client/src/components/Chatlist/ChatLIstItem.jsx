import React from "react";
import Avatar from "../common/Avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllContactsPage,
  setCurrentChatUser,
} from "@/features/user/userSlice";
import {
  sendFriendRequest,
  setPendingRequest,
} from "@/features/user/userSlice";
import { pusherClient } from "@/utils/PusherClient";
import { BsFillPersonPlusFill } from "react-icons/bs";

function ChatListItem(props) {
  const {
    data,
    isContactPage,
    friendRequestBtnRequired = true,
    pendingRequest = false,
    blocked = false,
  } = props;
  const { userInfo } = useSelector((reduxState) => reduxState.userReducer);
  const { chatId } = useSelector((reduxState) => reduxState.chatReducer);
  const dispatch = useDispatch();


  React.useEffect(() => {
    console.log("friendRequestBtnRequired", friendRequestBtnRequired)
    pusherClient.subscribe(`channel-${chatId}`);
    pusherClient.bind("event:friend-request-sent", frienRequestHandler);

    return () => {
      pusherClient.unsubscribe(`channel-${chatId}`);
      pusherClient.unbind("event:friend-request-sent", frienRequestHandler);
    };
  }, []);

  const handleContactClick = () => {
    dispatch(setCurrentChatUser({...data, pendingRequest}));
    // close the contactList Page
    // dispatch(setAllContactsPage());
  };

  const frienRequestHandler = (data) => {
    console.log(data);
    if (data.requesterId !== userInfo.id)
      dispatch(setPendingRequest(data.requester));
  };

  const handleFriendRequest = async () => {
    console.log("handleFriendRequest");
    dispatch(sendFriendRequest({ from: userInfo.id, to: data.id }));
  };

  return (
    <div
      className={`flex cursor-pointer items-center hover:bg-background-default-hover rounded-lg relative`}
      onClick={handleContactClick}
    >
      <div className="min-w-fit px-5 pt-3 pb-1">
        <Avatar type="sm" image={data?.profilePicture} />
      </div>
      <div className="min-w-full flex flex-col justify-center mt-3 pr-2 ">
        <div className="flex justify-between">
          <div>
            <span className="text-white text-[1rem]">{data?.name}</span>
          </div>
        </div>
        <div className="flex border-b border-conversation-border pb-2 pt-1">
          <div className="flex justify-between">
            <div className="text-secondary text-sm line-clamp-1 truncate">
              {data?.about || "\u00A0"}
            </div>

            {friendRequestBtnRequired && (
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
