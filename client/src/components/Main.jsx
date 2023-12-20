import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import { Router, useRouter } from "next/router";
import {
  setUser,
  setMessages,
  setSocket,
  addMessage,
} from "@/features/user/userSlice";
import socketIOClient from "socket.io-client";

const ChatList = dynamic(() => import("./Chatlist/ChatList"));
const Empty = dynamic(() => import("./Empty"));
const Chat = dynamic(() => import("./Chat/Chat"));

function Main() {
  const router = useRouter();

  let userInfo = useSelector((state) => state.userInfo);
  console.log("userInfo:", userInfo);
  const dispatch = useDispatch();
  const currentChatUser = useSelector((state) => state.currentChatUser);
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [socketEvent, setSocketEvent] = useState(false);
  const socketRef = useRef();

  useEffect(() => {
    if (redirectLogin) router.push("/login");
  }, [redirectLogin]);

  useEffect(() => {
    console.log("userInfo", userInfo);

    if (userInfo && !socketRef.current) {
      console.log("userInfo inside", userInfo);
      socketRef.current = socketIOClient(HOST);
      console.log("socketRef", socketRef);
      socketRef.current.emit("add-user", userInfo?.id);
      dispatch(setSocket(socketRef));
    }
  }, [userInfo]);

  useEffect(() => {
    console.log("msg-recieved event captured");
    if (socketRef.current && !socketEvent) {
      socketRef.current.on("msg-recieved", (data) => {
        console.log("msg-recieved event captured inside useEffect hook");
        console.log(data.message);
        dispatch(addMessage({ newMessage: { ...data.message } }));
      });
      setSocketEvent(true);
    }
  }, [socketRef.current]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const getMessagesURL = `${GET_MESSAGES_ROUTE}/${userInfo?.id}/${currentChatUser?.id}`;
        const { data } = await axios.get(getMessagesURL);
        // console.log(data.messages);
        dispatch(setMessages(data.messages));
      } catch (error) {
        console.log(error);
      }
    };
    if (currentChatUser) {
      getMessages();
    }
  }, [currentChatUser]);

  // it is like useEffect. it will run when the page refreshes
  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    console.log("onAuthStateChanged() userInfo:", userInfo);
    console.log("onAuthStateChanged() currentUser:", currentUser);

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
      <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-screen">
        <ChatList />
        {/* <Empty /> */}
        {userInfo && currentChatUser ? <Chat /> : <Empty />}
      </div>
    </>
  );
}

export default Main;
