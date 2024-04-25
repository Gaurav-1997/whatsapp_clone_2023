import React from "react";
import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "react-redux";
import { pusherClient } from "@/utils/PusherClient";
import {
  setCurrentChatUser,
  setPrivateChatId,
  setUser,
} from "@/features/user/userSlice";
import { toast } from "react-hot-toast";

const ContactListItem = dynamic(() => import("./ChatListItem"));

function List() {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((reduxState) => reduxState.userReducer);
  const { chatId } = useSelector((reduxState) => reduxState.chatReducer);
  // console.log("userPendingRequest", userPendingRequest);
  console.log("userInfo", userInfo);

  React.useEffect(() => {
    // if(userInfo){
    pusherClient.subscribe(`channel-${chatId}`);
    pusherClient.bind("incoming-friend-request", frienRequestHandler);
    console.log("listening on", `channel-${chatId}`);
    // }
    return () => {
      pusherClient.unsubscribe(`channel-${chatId}`);
      pusherClient.unbind("incoming-friend-request", frienRequestHandler);
    };
  }, [userInfo]);

  React.useEffect(() => {
    pusherClient.subscribe(`channel-${chatId}`);
    pusherClient.bind("friend-request-accepted", requestAcceptedHandler);
    console.log("listening on", `channel-${chatId}`);

    return () => {
      pusherClient.unsubscribe(`channel-${chatId}`);
      pusherClient.unbind("friend-request-accepted", requestAcceptedHandler);
    };
  }, [userInfo]);

  const requestAcceptedHandler = (data) => {
    console.log("requestAcceptedHandler", data);
    const toastStyle = {
      background: "#181a1b",
      fontSize: "14px",
      fontWeight: "normal",
      color: "whitesmoke",
      marginBottom: "15px",
    };

    if (userInfo.id !== data.approverData.id) {
      const { friends, ...rest } = userInfo;
      const updatedFriends = [data.approverData, ...friends];
      const updatedUserInfo = { ...rest, friends: updatedFriends };
      dispatch(setUser(updatedUserInfo));
      dispatch(setPrivateChatId(data.approverData.privateChatId));
      toast.success(`friend request accepted by ${data.approverData.name}`, {
        style: toastStyle,
        position: "bottom-left",
      });
    } else if (!data?.isAccepted) {
      // this happens on requester end
      const { requestSentTo, ...rest } = userInfo;
      const updatedUserInfo = { ...rest, requestSentTo: data.requestSentTo };
      dispatch(setUser(updatedUserInfo));
      dispatch(setCurrentChatUser(userInfo.friends[0]));
      toast.error(`Friend request rejected by ${data.name}`, {
        style: toastStyle,
        position: "bottom-left",
      });
    }
    //add in friends
  };

  const frienRequestHandler = (data) => {
    if (data.requester.id !== userInfo?.id) {
      const { pendingRequest, ...rest } = userInfo;
      const currPendingRequest = [data.requester, ...pendingRequest];
      const updatedUserInfo = { ...rest, pendingRequest: currPendingRequest };
      dispatch(setUser(updatedUserInfo));
    }
  };

  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {userInfo?.friends?.map((user) => (
        <ContactListItem data={user} />
      ))}
      {userInfo?.pendingRequest?.map((user) => (
        <ContactListItem data={user} pendingRequest={true} bgColor="black" />
      ))}
      {userInfo?.blockedUsers?.map((user) => (
        <ContactListItem data={user} blocked={true} />
      ))}
    </div>
  );
}

export default React.memo(List);
