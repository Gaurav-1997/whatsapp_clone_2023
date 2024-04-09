import React from "react";
import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "react-redux";
import { pusherClient } from "@/utils/PusherClient";
import { setPendingRequest } from "@/features/user/userSlice";

const ContactListItem = dynamic(() => import("./ChatListItem"));

function List() {
  const dispatch = useDispatch();

  const { userInfo, userPendingRequest } = useSelector(
    (reduxState) => reduxState.userReducer
  );
  const { chatId } = useSelector((reduxState) => reduxState.chatReducer);
  console.log("userPendingRequest", userPendingRequest);
  console.log("userInfo", userInfo);

  // React.useEffect(() => {
  //   pusherClient.subscribe(`channel-${chatId}`);
  //   pusherClient.bind("event:friend-request-sent", frienRequestHandler);

  //   return () => {
  //     pusherClient.unsubscribe(`channel-${chatId}`);
  //     pusherClient.unbind("event:friend-request-sent", frienRequestHandler);
  //   };
  // }, []);

  const frienRequestHandler = (data) => {
    console.log(data);
    if (data.requesterId !== userInfo.id)
      dispatch(setPendingRequest(data.requester));
  };

  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {userInfo?.friends?.map((user) => (
        <ContactListItem friendRequestBtnRequired={false} data={user}/>
      ))}
      {userInfo?.pendingRequest?.map((user) => (
        <ContactListItem friendRequestBtnRequired={false} data={user} pendingRequest={true}/>
      ))}
      {userInfo?.blockedUsers?.map((user) => (
        <ContactListItem friendRequestBtnRequired={false} data={user} blocked={true}/>
      ))}
    </div>
  );
}

export default List;
