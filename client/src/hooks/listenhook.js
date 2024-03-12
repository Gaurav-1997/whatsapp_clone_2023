import { addMessage } from "@/features/chat/chatSlice";
import { socketClient } from "@/pages/_app";
import { CONNECTED } from "@/utils/SocketStatus";
import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const listenHook =()=>{
    const dispatch = useDispatch()
    const {messages} = useSelector(redux=>redux.chatReducer);
    const {connectionStatus} = useSelector(reduxState=>reduxState.socketReducer);
    const [socketEvent, setSocketEvent] = useState(false);

    useEffect(()=>{
        if (connectionStatus===CONNECTED && !socketEvent) {
          socketClient.on("msg-recieved", (data) => {
            console.log("msg-recieved event");
            console.log(data.message);
            dispatch(addMessage({ newMessage: { ...data.message } }));
          });
          setSocketEvent(true);
        }
        console.log("message useEffect")
    },[messages])

}

export default listenHook;