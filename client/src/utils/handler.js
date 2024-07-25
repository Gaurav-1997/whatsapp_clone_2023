import { MenuItem } from "@headlessui/react";
import { TiDelete } from "react-icons/ti";
import { MdEdit, MdOutlineReply, MdPushPin } from "react-icons/md";
import { RiDeleteBin6Fill, RiChatDeleteFill } from "react-icons/ri";

export const menuItemsOnSelf = [
  {
    id: "mi-1",
    label: "Edit",
    action: "edit",
    menuIcon: <MdEdit className="size-4 fill-white/30" />,
  },
  {
    id: "mi-2",
    label: "Reply",
    action: "reply",
    menuIcon: <MdOutlineReply className="size-4 fill-white/30" />,
  },
  {
    id: "mi-3",
    label: "Pin to Top",
    action: "pin_to_top",
    menuIcon: <MdPushPin className="size-4 fill-white/30" />,
  },
  {
    id: "mi-4",
    label: "Delete for me",
    action: "delete_for_me",
    menuIcon: <RiDeleteBin6Fill className="size-4 fill-white/30" />,
  },
  {
    id: "mi-4",
    label: "Delete for Everyone",
    action: "delete_for_everyone",
    menuIcon: <RiChatDeleteFill className="size-4 fill-white/30" />,
  },
  {
    id: "mi-4",
    label: "Delete",
    action: "delete",
    menuIcon: <TiDelete className="size-4 fill-white/30" />,
  },
];

export const menuItemsOnRecievedMessage = [
  {
    id: "mi-1",
    label: "Reply",
    action: "reply",
    menuIcon: <MdOutlineReply className="size-4 fill-white/30" />,
  },
  {
    id: "mi-2",
    label: "Pin to Top",
    action: "pin_to_top",
    menuIcon: <MdPushPin className="size-4 fill-white/30" />,
  },
  {
    id: "mi-3",
    label: "Delete",
    action: "delete",
    menuIcon: <RiChatDeleteFill className="size-4 fill-white/30" />,
  },
];

export const reactionEmojis = {
  LIKE: "👍",
  LOVE: "❤️",
  LAUGH: "😂",
  SAD: "😢",
  ANGRY: "😠",
  WOW: "😮",
};
