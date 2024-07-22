const { reactionEmojis } = require("./handler");


export const getEmoMap =(reactions)=>{
    const emoMap = new Map();
    reactions.forEach(emo => {
        if(!emoMap[emo.reactionType]){
            emoMap[emo.reactionType] = 1;
        }else{
            emoMap[emo.reactionType] = emoMap[emo.reactionType] + 1;
        }
    })
    return emoMap;
}