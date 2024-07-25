import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import React from "react";
import { FaChevronDown } from "react-icons/fa";

const DropDownMenu = (props) => {
  const { anchor ,menuItems, handleMenuAction, setFromSelf } = props;
  return (
    <>
      <Menu>
        <MenuButton className="absolute right-1 top-1 cursor-pointer opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
          <FaChevronDown className="size-4 fill-white/60" />
        </MenuButton>

        <MenuItems
          transition
          anchor={anchor}
          className="z-10 w-52 origin-top-right rounded-xl border border-white/5 bg-gray-800/50 backdrop-blur-lg p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          {menuItems.map((menu) => (
            <MenuItem key={menu.id}>
              <button
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                onClick={() => {
                  handleMenuAction(menu.action);
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
    </>
  );
};

export default DropDownMenu;
