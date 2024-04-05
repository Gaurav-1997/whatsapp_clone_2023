import React, { memo, useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { getAllContacts, setUser } from "@/features/user/userSlice";
import { connectSocket, disconnectFromSocket } from "@/features/socket/socketSlice";
import { CONNECTED } from "@/utils/SocketStatus"
import { addUser, getMessages } from "@/features/chat/chatSlice"
import { socketClient } from "@/pages/_app";
import listenHook from "@/hooks/listenhook";
import preLoadIt from "@/preLoaded/preLoadIt";


const ChatList = dynamic(() => import("./Chatlist/ChatList"));
const Empty = dynamic(() => import("./Empty"));
const Chat = dynamic(() => import("./Chat/Chat"));
const SearchMessages = dynamic(() => import("./Chat/SearchMessages"));

function Main() {
  const router = useRouter();

  listenHook();
  preLoadIt();
  const dispatch = useDispatch();
  const [redirectLogin, setRedirectLogin] = useState(false);
  const { connectionStatus } = useSelector(reduxState => reduxState.socketReducer);
  const { searchMessage } = useSelector(reduxState => reduxState.chatReducer);
  let { userInfo, currentChatUser } = useSelector((reduxState) => reduxState.userReducer);

  useEffect(() => {
    if (redirectLogin) router.push("/login");
  }, [redirectLogin]);

  useEffect(() => {
    if (userInfo) {
      console.log("new Socket method");
      dispatch(connectSocket());
      dispatch(addUser(userInfo?.id))
    }
    console.log("Socket", socketClient);

    return () => {
      if (connectionStatus === CONNECTED) {
        dispatch(disconnectFromSocket())
      }
    }
  }
    , [userInfo])

  useEffect(() => {
    if (currentChatUser) {
      dispatch(getMessages({ senderId: userInfo?.id, recieverId: currentChatUser?.id }))
    }
  }, [currentChatUser]);

  // it is like useEffect. it will run when the page refreshes
  onAuthStateChanged(firebaseAuth, async (currentUser) => {

    if (!currentUser) setRedirectLogin(true);
    if (!userInfo && currentUser?.email) {
      // console.log("currentuser from main.jsx", currentUser);
      const { data } = await axios.post(CHECK_USER_ROUTE, {
        email: currentUser.email,
      });
      if (!data.status) {
        router.push("/login");
      }
      console.log(data);
      if (data?.data) {
        userInfo = {
          id: data.data.id,
          name: data.data.name,
          email: data.data.email,
          profilePicture: data.data.profilePicture,
          status: data.data.about,
        };
        // userInfo = [ id, name, email, profilePicture, status ];
        console.log("setUser() dispatch from main.jsx");
        dispatch(setUser(userInfo));
      }
    }
  });

  return (
    <>
      <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-screen transition-translate duration-300 ease-in-out overflow-hidden">
        <ChatList />

        {userInfo && currentChatUser ?
          <div
            className={`grid ${searchMessage ? 'grid-cols-2' : 'grid-cols-1'}`}>
                
            <Chat/>
            {searchMessage && <SearchMessages />}
          </div>
          : <Empty />}
      </div >
    </>
  );
}

export default memo(Main);
