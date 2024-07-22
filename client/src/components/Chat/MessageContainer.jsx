import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageMessage from "./ImageMessage";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "@/components/common/MessageStatus";
import { FaChevronDown } from "react-icons/fa6";
import { ImEvil2 } from "react-icons/im";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  menuItemsOnRecievedMessage,
  menuItemsOnSelf,
  reactionEmojis,
} from "@/utils/handler";
import EditMessage from "../common/EditMessage";
import {
  setReplyEnabled,
  updateEmojiReaction,
} from "@/features/chat/chatSlice";
import MessageReplyBox from "./MessageRelpyBox";
import ReactionEmojiPill from "../common/ReactionEmojiPill";

const MessageContainer = ({ message }) => {
  const { userInfo, currentChatUser } = useSelector(
    (state) => state.userReducer
  );
  const dispatch = useDispatch();
  const [fromSelf, setFromSelf] = React.useState(false);

  const [editModalIsOpen, setEditModalIsOpen] = React.useState(false);
  const [isReactionEmojisVisible, setIsReactionEmojisVisible] =
    React.useState(false);

  const handleMenuAction = (action) => {
    if (action.toLowerCase() === "reply") {
      dispatch(
        setReplyEnabled({
          replyEnabled: true,
          parentMessage: message?.content,
          parentMessageId: message?.id,
          fromSelf,
        })
      );
    }
  };

  const handleReactionEmoji = (emojiType) => {
    setIsReactionEmojisVisible(false);
    dispatch(
      updateEmojiReaction({
        reactionType: emojiType,
        parentMessageId: message?.id,
        reactedByUserName: userInfo?.name,
        recieverId: currentChatUser?.id
      })
    );
  };

  return (
    <div
      id={message?.id}
      className={`flex ${
        message.senderId === currentChatUser.id
          ? "justify-start"
          : "justify-end"
      } px-1`}
    >
      {message.type === "TEXT" && (
        <>
          <div
            className={`message-container group relative flex flex-col text-white px-2 py-1 text-sm rounded-md gap-1 items-end max-w-[70%]
  ${
    message.senderId !== currentChatUser.id
      ? "bg-incoming-background"
      : "bg-outgoing-background"
  }
  ${message?.reactions?.length > 0 ? "mb-1" : ""}
  `}
          >
            {!(message.senderId === currentChatUser.id) ? (
              <Menu>
                <MenuButton className="absolute right-1 top-1 cursor-pointer opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                  <FaChevronDown className="size-4 fill-white/60" />
                </MenuButton>

                <MenuItems
                  transition
                  anchor="bottom end"
                  className="z-10 w-52 origin-top-right rounded-xl border border-white/5 bg-gray-800/50 backdrop-blur-lg p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                  {menuItemsOnSelf.map((menu) => (
                    <MenuItem key={menu.id}>
                      <button
                        className="flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                        onClick={() => {
                          handleMenuAction(menu.label);
                          setFromSelf(true);
                        }}
                      >
                        {menu.menuIcon}
                        {menu.label}
                      </button>
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            ) : (
              <Menu>
                <MenuButton className="absolute right-1 top-1 cursor-pointer opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                  <FaChevronDown className="size-4 fill-white/60" />
                </MenuButton>

                <MenuItems
                  transition
                  anchor="bottom start"
                  className="z-10 w-52 origin-top-right rounded-xl border border-white/5 bg-green-950/50 backdrop-blur-lg p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                  {menuItemsOnRecievedMessage.map((menu) => (
                    <MenuItem key={menu.id}>
                      <button
                        className="flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                        onClick={() => {
                          handleMenuAction(menu.label);
                          setFromSelf(false);
                        }}
                      >
                        {menu.menuIcon}
                        {menu.label}
                      </button>
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            )}
            {message?.parentMessageContent && message?.parentMessageId && (
              <MessageReplyBox message={message} />
            )}
            <div className="break-all text-left w-full mr-1">
              {message.content}
            </div>
            <div className="flex flex-row gap-1 items-end  bottom-1 right-1">
              <span className="block text-bubble-meta text-[10px] pt-0 min-w-fit">
                {calculateTime(message?.sent_at)}
              </span>
              <span className="block">
                {message?.senderId === userInfo.id && (
                  <MessageStatus messageStatus={message?.messageStatus} />
                )}
              </span>
            </div>
            <button
              className={`absolute bg-gray-800 p-1 rounded-xl ${
                message.senderId === currentChatUser.id ? "-right-7" : "-left-7"
              } top-[30%] cursor-pointer opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 delay-100 ease-in-out`}
              onClick={() =>
                setIsReactionEmojisVisible(!isReactionEmojisVisible)
              }
            >
              <ImEvil2 className="size-4 fill-white/50" />
            </button>

            {isReactionEmojisVisible && (
              <div
                className={`emojis absolute flex rounded-xl p-1 ${
                  message.senderId === currentChatUser.id
                    ? "-right-48 bg-green-950/50 -top-14"
                    : "-left-40 bg-gray-950/50 -top-14"
                } border border-white/5  backdrop-blur-lg
                transition-all duration-300 ease-out`}
              >
                {Object.entries(reactionEmojis).map(([type, emoji]) => (
                  <button
                    key={type}
                    className="hover:bg-gray-600 rounded-full p-1 transition-colors duration-200"
                    onClick={() => handleReactionEmoji(type)}
                  >
                    <span className="text-2xl">{emoji}</span>
                  </button>
                ))}
              </div>
            )}

            {message?.reactions?.length > 0 && (
              <ReactionEmojiPill reactions={message?.reactions} />
            )}
          </div>
        </>
      )}
      {message?.type === "image" && <ImageMessage message={message} />}
      <EditMessage isOpen={editModalIsOpen} close={setEditModalIsOpen} />
    </div>
  );
};

export default MessageContainer;
