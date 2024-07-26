import React, { memo, useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { setUser, setUserLoading } from "@/features/user/userSlice";
import { setChatId } from "@/features/chat/chatSlice";
import { Toaster, toast } from "react-hot-toast";

const ChatList = dynamic(() => import("./Chatlist/ChatList"));
const Empty = dynamic(() => import("./Empty"));
const Chat = dynamic(() => import("./Chat/Chat"));
const SearchMessages = dynamic(() => import("./Chat/SearchMessages"));

function Main() {
  const router = useRouter();
  let {
    userInfo,
    currentChatUser,
    toastMessage,
    showToastMessage,
    showLoadingToast,
    toastStatus,
  } = useSelector((reduxState) => reduxState.userReducer);

  useEffect(() => {    
    const toastStyle = {
      background: "#181a1b",
      fontSize: "14px",
      fontWeight: "normal",
      color: "whitesmoke",
      marginBottom: "15px",
    };

    if (toastMessage) {
      if (toastStatus === "loading") {
        toast.loading(toastMessage, {
          position: "bottom-left",
          style: toastStyle,
          duration: 3000,
        });
      } else if (toastStatus === "success") {
        toast.success(toastMessage, {
          position: "bottom-left",
          style: toastStyle,
          duration: 3000,
        });
      } else {
        toast.error(toastMessage, {
          position: "bottom-left",
          style: toastStyle,
          duration: 3000,
        });
      }
    }
  }, [toastMessage, showToastMessage, showLoadingToast, toastStatus]);

  const dispatch = useDispatch();
  const [redirectLogin, setRedirectLogin] = useState(false);

  const { searchMessage } = useSelector((reduxState) => reduxState.chatReducer);

  useEffect(() => {
    if (redirectLogin) router.push("/login");
  }, [redirectLogin]);


  // it is like useEffect. it will run when the page refreshes
  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser) setRedirectLogin(true);
    if (!userInfo && currentUser?.email) {
      // console.log("currentuser from main.jsx", currentUser);
      try {
        dispatch(setUserLoading(true));
        const { data } = await axios.post(CHECK_USER_ROUTE, {
          email: currentUser.email,
        });
        if (!data.status) {
          router.push("/login");
        }
        // console.log(data);
        if (data?.data) {
          userInfo = {
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            profilePicture: data.data.profilePicture,
            status: data.data.about,
            friends: data.data.friends,
            pendingRequest: data.data.pendingRequest,
            blockedUsers: data.data.blockedUsers,
            requestSentTo: data.data.requestSentTo,
          };
          dispatch(setChatId(data.data.pusherId));
          dispatch(setUser(userInfo));
          dispatch(setUserLoading(false));
        }
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setUserLoading(false));
      }
    }
  });

  return (
    <>
      <div className="grid grid-cols-main h-screen w-auto max-h-screen max-w-screen p-2 bg-cyan-700 transition-translate duration-300 ease-in-out overflow-hidden">
        <ChatList />

        {userInfo && currentChatUser ? (
          <div
            className={`grid ${searchMessage ? "grid-cols-2" : "grid-cols-1"}`}
          >
            <Chat />
            {searchMessage && <SearchMessages />}
          </div>
        ) : (
          <Empty />
        )}
        <Toaster />
      </div>
    </>
  );
}

export default memo(Main);
