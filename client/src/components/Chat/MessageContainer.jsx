import React from "react";
import { useSelector } from "react-redux";
import ImageMessage from "./ImageMessage";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "@/components/common/MessageStatus";
import { FaChevronDown } from "react-icons/fa6";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { menuItemsOnRecievedMessage, menuItemsOnSelf } from "@/utils/handler";
import EditMessage from "../common/EditMessage";

const MessageContainer = (props) => {
  const { message } = props;
  const { userInfo, currentChatUser } = useSelector(
    (state) => state.userReducer
  );

  const [editModalIsOpen, setEditModalIsOpen] = React.useState(false);

  const handleMenuAction = (action) => {
    if(action === 'edit'){
        setEditModalIsOpen(true)
        console.log(action,message.id, message.content)
    }
  }
 
  return (
    <div
      key={message.id}
      className={`flex ${
        message.senderId === currentChatUser.id
          ? "justify-start"
          : "justify-end"
      } px-1 `}
    >
      {message.type === "TEXT" && (
        <div
          className={`group flex flex-col text-white px-2 py-1 text-sm rounded-md gap-2 items-end max-w-[70%] relative
  ${
    message.senderId !== currentChatUser.id
      ? "bg-incoming-background"
      : "bg-outgoing-background"
  }`}
        >
          {!(message.senderId === currentChatUser.id) ? 
          (
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
                    onClick={()=>handleMenuAction('edit')}
                    >
                    {menu.menuIcon}
                    {menu.label}
                  </button>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
          ):
          (<Menu>
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
                  <button className="flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                    {menu.menuIcon}
                    {menu.label}
                  </button>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>)
          }
          
          <div className="break-all text-left w-full mr-1">
            {message.content}
          </div>
          <div className="flex flex-row gap-1 items-end  bottom-1 right-1">
            <span className="block text-bubble-meta text-[10px] pt-1 min-w-fit">
              {calculateTime(message?.sent_at)}
            </span>
            <span className="block">
              {message?.senderId === userInfo.id && (
                <MessageStatus messageStatus={message?.messageStatus} />
              )}
            </span>
          </div>
        </div>
      )}
      {message?.type === "image" && <ImageMessage message={message} />}
      <EditMessage isOpen={editModalIsOpen} close={setEditModalIsOpen}/>
    </div>
  );
};

export default MessageContainer;
