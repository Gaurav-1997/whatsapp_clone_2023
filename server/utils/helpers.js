export const getUserStatus = (userId="") =>{
    return global.onlineUsers.get(userId);
}
export const getCurrenChatUserFor = (userId="") =>{
    return global.currentChatUserIdMap.get(userId);
}