import { MenuItem } from "@headlessui/react";
import { IoMdArrowDropleft } from "react-icons/io";
import { MdEdit, MdOutlineReply, MdPushPin } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

export const menuItemsOnSelf = [
  {
    id: "mi-1",
    label: "Edit",
    menuIcon: <MdEdit className="size-4 fill-white/30" />,
  },
  {
    id: "mi-2",
    label: "Reply",
    menuIcon: <MdOutlineReply className="size-4 fill-white/30" />,
  },
  {
    id: "mi-3",
    label: "Pin to Top",
    menuIcon: <MdPushPin className="size-4 fill-white/30" />,
  },
  {
    id: "mi-4",
    label: "Delete",
    menuIcon: (
      <>
        <RiDeleteBin6Fill className="size-4 fill-white/30 group-hover:hidden" />
        <input type="checkbox" className="hidden peer" id="delete-dropdown"/>
        <IoMdArrowDropleft for="delete-dropdown" className="size-4 fill-white/30 hidden group-hover:block" />
        <div for="delete-dropdown" className="">Dete</div>
        <div className="hidden peer-checked:block ">Delete Sample</div>
      </>
    ),
  },
];
export const menuItemsOnRecievedMessage = [
  {
    id: "mi-1",
    label: "Reply",
    menuIcon: <MdOutlineReply className="size-4 fill-white/30" />,
  },
  {
    id: "mi-2",
    label: "Pin to Top",
    menuIcon: <MdPushPin className="size-4 fill-white/30" />,
  },
  {
    id: "mi-3",
    label: "Delete",
    menuIcon: (
      <div className="flex flex-col">
        {" "}
        <MenuItem>
          <button className="flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
            Delete For Me
          </button>
        </MenuItem>
        <MenuItem>
          <button className="flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
            Delete For Everyone
          </button>
        </MenuItem>
      </div>
    ),
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
