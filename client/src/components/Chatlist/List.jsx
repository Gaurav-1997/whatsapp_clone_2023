import React from "react";
import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "react-redux";
import { pusherClient } from "@/utils/PusherClient";
import { setUser } from "@/features/user/userSlice";

const ContactListItem = dynamic(() => import("./ChatListItem"));

function List() {
  const dispatch = useDispatch();

  const { userInfo } = useSelector(
    (reduxState) => reduxState.userReducer
  );
  const { chatId } = useSelector((reduxState) => reduxState.chatReducer);
  // console.log("userPendingRequest", userPendingRequest);
  console.log("userInfo", userInfo);

  React.useEffect(() => {
    // if(userInfo){
      pusherClient.subscribe(`channel-${chatId}`);
      pusherClient.bind("incoming-friend-request", frienRequestHandler);
      console.log('listening on', `channel-${chatId}`)
    // }
    return () => {
      pusherClient.unsubscribe(`channel-${chatId}`);
      pusherClient.unbind("incoming-friend-request", frienRequestHandler);
    };
  }, [userInfo]);

  React.useEffect(() => {
    // if(userInfo){
      pusherClient.subscribe(`channel-${chatId}`);
      pusherClient.bind("friend-request-accepted", requestAcceptedHandler);
      console.log('listening on', `channel-${chatId}`)
    // }
    return () => {
      pusherClient.unsubscribe(`channel-${chatId}`);
      pusherClient.unbind("friend-request-accepted", requestAcceptedHandler);
    };
  }, [userInfo]);

  const requestAcceptedHandler =(data)=>{
    //add in friends
    alert("friends request accepted")
    const {friends, ...rest } = userInfo;
    const updatedFriends = [data.approverData, ...friends]
    const updatedUserInfo = {...rest, friends: updatedFriends}
    dispatch(setUser(updatedUserInfo))
  }

  const frienRequestHandler = (data) => {
    if (data.requester.id !== userInfo?.id){
      const {pendingRequest, ...rest} = userInfo
      const currPendingRequest = [data.requester, ...pendingRequest]
      const updatedUserInfo = {...rest, pendingRequest: currPendingRequest}
      dispatch(setUser(updatedUserInfo));
    }
  };

  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {userInfo?.friends?.map((user) => (
        <ContactListItem friendRequestBtnRequired={false} data={user}/>
      ))}
      {userInfo?.pendingRequest?.map((user) => (
        <ContactListItem friendRequestBtnRequired={false} data={user} pendingRequest={true} bgColor="black"/>
      ))}
      {userInfo?.blockedUsers?.map((user) => (
        <ContactListItem friendRequestBtnRequired={false} data={user} blocked={true}/>
      ))}
    </div>
  );
}

export default React.memo(List);
