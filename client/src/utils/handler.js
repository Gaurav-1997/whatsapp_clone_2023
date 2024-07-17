import { HiDocumentDuplicate } from "react-icons/hi";
import { MdAddReaction, MdEdit, MdOutlineReply, MdPushPin } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

export const menuItemsOnSelf = [
    { id: 'mi-1', label: "Edit", menuIcon: <MdEdit className="size-4 fill-white/30"/> },
    { id: 'mi-2', label: "Duplicate", menuIcon: <HiDocumentDuplicate className="size-4 fill-white/30"/> },
    { id: 'mi-3', label: "Pin to Top", menuIcon: <MdPushPin className="size-4 fill-white/30"/> },
    { id: 'mi-4', label: "Delete", menuIcon: <RiDeleteBin6Fill className="size-4 fill-white/30"/> },
  ];
export const menuItemsOnRecievedMessage = [
    { id: 'mi-1', label: "Reply", menuIcon: <MdOutlineReply className="size-4 fill-white/30"/> },
    { id: 'mi-2', label: "React", menuIcon: <MdAddReaction className="size-4 fill-white/30"/> },
    { id: 'mi-3', label: "Pin to Top", menuIcon: <MdPushPin className="size-4 fill-white/30"/> },
    { id: 'mi-4', label: "Delete", menuIcon: <RiDeleteBin6Fill className="size-4 fill-white/30"/> },
  ];