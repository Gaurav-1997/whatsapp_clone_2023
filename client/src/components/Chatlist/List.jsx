import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { pusherClient } from "@/utils/PusherClient";
import { setPendingRequest } from "@/features/user/userSlice";

function List() {

  const dispatch = useDispatch()

  const { userInfo, userPendingRequest } = useSelector(
    (reduxState) => reduxState.userReducer
  );
  const { chatId } = useSelector((reduxState) => reduxState.chatReducer);
  console.log("userPendingRequest", userPendingRequest);
  React.useEffect(() => {
    pusherClient.subscribe(`channel-${chatId}`);
    pusherClient.bind("event:friend-request-sent", frienRequestHandler);

    return () => {
      pusherClient.unsubscribe(`channel-${chatId}`);
      pusherClient.unbind("event:friend-request-sent", frienRequestHandler);
    };
  }, []);

  const frienRequestHandler = (data) => {
    console.log(data);
    if (data.requesterId !== userInfo.id)
      dispatch(setPendingRequest(data.requester));
  };

  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      List
    </div>
  );
}

export default List;
