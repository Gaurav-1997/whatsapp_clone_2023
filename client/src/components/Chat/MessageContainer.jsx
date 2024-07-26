import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageMessage from "./ImageMessage";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "@/components/common/MessageStatus";
import { ImEvil2 } from "react-icons/im";
import { MdOutlineBlock } from "react-icons/md";
import {
  menuItemsOnRecievedMessage,
  menuItemsOnSelf,
  reactionEmojis,
  permaDeleteMenu,
} from "@/utils/handler";
import {
  partialDelete,
  permaDelete,
  setMessageToEdit,
  setReplyEnabled,
  updateEmojiReaction,
} from "@/features/chat/chatSlice";
import MessageReplyBox from "./MessageRelpyBox";
import ReactionEmojiPill from "../common/ReactionEmojiPill";
import dynamic from "next/dynamic";

const DropDownMenu = dynamic(() => import("../common/DropDownMenu"));

const MessageContainer = (props) => {
  const { message, setEditModalIsOpen, editing = false } = props;

  const { userInfo, currentChatUser } = useSelector(
    (state) => state.userReducer
  );

  /*message donot  render for delete_for_me action*/
  if (
    message?.deletedFor &&
    (Number(message?.deletedFor) === userInfo?.id)
    // Number(message?.deletedFor) === currentChatUser?.id)
  )
    return;

  const dispatch = useDispatch();
  const [fromSelf, setFromSelf] = React.useState(false);

  const [isReactionEmojisVisible, setIsReactionEmojisVisible] =
    React.useState(false);

  const handleMenuAction = (action) => {
    switch (action.toLowerCase()) {
      case "reply":
        dispatch(
          setReplyEnabled({
            replyEnabled: true,
            parentMessage: message?.content,
            parentMessageId: message?.id,
            fromSelf,
          })
        );
        break;
      case "edit":
        dispatch(setMessageToEdit(message));
        setEditModalIsOpen(true);
        break;
      case "delete_for_me":
        dispatch(
          partialDelete({
            id: message?.id,
            deletedFor: String(userInfo?.id),
            deletedBy: userInfo?.id,
            recieverId: currentChatUser?.id,
          })
        );
        break;
      case "delete_for_everyone":
        dispatch(
          partialDelete({
            id: message?.id,
            deletedFor: "all",
            deletedBy: userInfo?.id,
            recieverId: currentChatUser?.id,
          })
        );
        break;
      case "delete":
        if (message?.senderId === currentChatUser?.id) {
          if (Number(message?.deletedFor) === currentChatUser?.id) {
            permaDelete({
              id: message?.id,
              senderId: userInfo?.id,
              recieverId: currentChatUser?.id,
            });
          } else {
            dispatch(
              partialDelete({
                id: message?.id,
                deletedFor: String(userInfo?.id),
                deletedBy: userInfo?.id,
                recieverId: currentChatUser?.id,
              })
            );
          }
        }

        dispatch(
          permaDelete({
            id: message?.id,
            senderId: userInfo?.id,
            recieverId: currentChatUser?.id,
          })
        );
        break;
      case "delete_recieved_chat":
        // check if sender deleted this chat for himself
        //then permanent delete message
        if (Number(message?.deletedFor) === currentChatUser?.id) {
          permaDelete({
            id: message?.id,
            senderId: userInfo?.id,
            recieverId: currentChatUser?.id,
          });
        } else {
          dispatch(
            partialDelete({
              id: message?.id,
              deletedFor: userInfo?.id,
              deletedBy: userInfo?.id,
              recieverId: currentChatUser?.id,
            })
          );
        }
        break;

      default:
        break;
    }
  };

  const handleReactionEmoji = (emojiType) => {
    setIsReactionEmojisVisible(false);
    dispatch(
      updateEmojiReaction({
        reactionType: emojiType,
        parentMessageId: message?.id,
        reactedByUserName: userInfo?.name,
        reactedByUserId: userInfo?.id,
        recieverId: currentChatUser?.id,
      })
    );
  };

  /* message deleted for everyone */
  if (message?.deletedFor === "all") {
    return (
      <div
        id={message?.id}
        className={`flex ${
          message.senderId === currentChatUser.id
            ? "justify-start"
            : "justify-end"
        } px-1`}
      >
        <div
          className={`message-container group relative flex flex-col text-white px-2 py-1 text-sm rounded-md gap-1 items-end max-w-[70%]
  ${
    message.senderId !== currentChatUser.id
      ? "bg-incoming-background"
      : "bg-outgoing-background"
  }`}
        >
          <div className="flex gap-1 items-center break-all text-left w-full mr-1">
            {!(message.senderId === currentChatUser.id) ? (
              <DropDownMenu
                anchor={"bottom end"}
                menuItems={permaDeleteMenu}
                handleMenuAction={handleMenuAction}
                setFromSelf={setFromSelf}
              />
            ) : (
              <DropDownMenu
                anchor={"bottom start"}
                menuItems={permaDeleteMenu}
                handleMenuAction={handleMenuAction}
                setFromSelf={setFromSelf}
              />
            )}
            <>
              <MdOutlineBlock className="size-4 fill-white/30" />
              <span>
                {message?.senderId === userInfo?.id
                  ? "You deleted this message"
                  : "This message is deleted"}
              </span>
            </>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={message?.id}
      className={`flex ${
        message.senderId === currentChatUser.id
          ? "justify-start"
          : "justify-end"
      } px-1`}
    >
      {isNaN(message?.deletedFor)}
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
              <DropDownMenu
                anchor={"bottom end"}
                menuItems={menuItemsOnSelf}
                handleMenuAction={handleMenuAction}
                setFromSelf={setFromSelf}
              />
            ) : (
              <DropDownMenu
                anchor={"bottom start"}
                menuItems={menuItemsOnRecievedMessage}
                handleMenuAction={handleMenuAction}
                setFromSelf={setFromSelf}
              />
            )}
            {message?.parentMessageContent && message?.parentMessageId && (
              <MessageReplyBox message={message} />
            )}
            <div className="break-all text-left w-full mr-1">
              {message.content}
            </div>
            <div className="flex flex-row gap-1 items-end  bottom-1 right-1">
              <span className="block text-bubble-meta text-[10px] pt-0 min-w-fit">
                <i className="mr-1">{message?.isEdited ? "Edited" : ""}</i>
                {calculateTime(message?.sent_at)}
              </span>
              <span className="block">
                {message?.senderId === userInfo.id && (
                  <MessageStatus messageStatus={message?.messageStatus} />
                )}
              </span>
            </div>
            {/* Reaction button */}
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

            {!editing && message?.reactions?.length > 0 && (
              <ReactionEmojiPill reactions={message?.reactions} />
            )}
          </div>
        </>
      )}
      {message?.type === "image" && <ImageMessage message={message} />}
    </div>
  );
};

export default MessageContainer;
