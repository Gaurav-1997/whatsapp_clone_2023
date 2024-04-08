import { addMessage } from "@/features/chat/chatSlice";
import { socketClient } from "@/pages/_app";
import { CONNECTED } from "@/utils/SocketStatus";
import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { disconnectFromSocket } from "@/features/socket/socketSlice";

const listenHook =()=>{
    const dispatch = useDispatch()
    const {messages} = useSelector(redux=>redux.chatReducer);
    const {connectionStatus} = useSelector(reduxState=>reduxState.socketReducer);
    const [socketEvent, setSocketEvent] = useState(false);

    useEffect(()=>{
        if (connectionStatus===CONNECTED && !socketEvent) {
          socketClient.on("msg-recieved", (data) => {
            dispatch(addMessage({ newMessage: { ...data.message } }));
          });
          setSocketEvent(true);
        }

        return () => {
          if (connectionStatus === CONNECTED) {
            dispatch(disconnectFromSocket())
          }
        }
      },[messages])
}
const listenfriendRequest =()=>{
    const dispatch = useDispatch()
    const {connectionStatus} = useSelector(reduxState=>reduxState.socketReducer);
    const [socketEvent, setSocketEvent] = useState(false);
      
      useEffect(()=>{
        console.log("friend-request-recieved out useffect")
        if(connectionStatus === CONNECTED && !socketEvent){
          console.log("friend-request-recieved in useffect")
          socketClient.on("friend-request-recieved",(data)=>{
            alert('friend-request-recieved from' , data )
          })
          setSocketEvent(true);
        }

        return () => {
          if (connectionStatus === CONNECTED) {
            dispatch(disconnectFromSocket())
          }
        }
    },[]) 
}

export {listenHook, listenfriendRequest};