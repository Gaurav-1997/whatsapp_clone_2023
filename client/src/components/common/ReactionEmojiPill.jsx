import React from "react";
import { getEmoMap } from "@/utils/helper";
import { reactionEmojis } from "@/utils/handler";

const ReactionEmojiPill = ({ reactions }) => {
  const emoMap = getEmoMap(reactions);

  return (
    <div className="reaction-pill flex justify-start absolute -bottom-2 left-1 bg-slate-50/20 rounded-full cursor-pointer">
      {Object.entries(emoMap).map(([emoji, count], index) => (
        <span
          className={`emoji ml-${index}`}
          key={`${emoji}-${count}`}
        >
          {reactionEmojis[emoji]}
        </span>
      ))}
    </div>
  );
};

export default ReactionEmojiPill;
