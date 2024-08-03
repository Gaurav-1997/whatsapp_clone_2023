import { pusherServer } from "./PusherServer";

export const getUserStatus = (userId="") =>{
    return global.onlineUsers.get(userId);
}
export const getCurrenChatUserFor = (userId="") =>{
    return global.currentChatUserIdMap.get(userId);
}

export const pusherService =(channelId, event, data)=>{
    pusherServer.trigger(channelId, event, data);
    return;
}