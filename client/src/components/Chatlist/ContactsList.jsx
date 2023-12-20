import { setAllContactsPage, setAllUsers } from "@/features/user/userSlice";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiArrowBack, BiSearchAlt2, BiLoader } from "react-icons/bi";
import { FiLoader } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";

const ChatListItem = dynamic(() => import("./ChatListItem"));

function ContactsList() {
  const userInfo = useSelector((state) => state.userInfo);
  const [allContacts, setAllContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const getContacts = async () => {
      const {
        data: { users },
      } = await axios.get(`${GET_ALL_CONTACTS}/${userInfo?.id}`);
      console.log("getContacts api called");
      try {
        // dispatch(setAllUsers(users));
        setAllContacts(users);
        setLoading(false);
      } catch (error) {
        console.log(err);
      }
    };

    // if (allUsers) {
    //   setLoading(false);
    // } else
    getContacts();
  }, []);

  // console.log("allContacts:", allContacts);

  return (
    <div className="h-full flex flex-col ">
      <div className="h-24 flex items-end px-3 py-4">
        <div className="flex items-center gap-12 text-white ">
          <BiArrowBack
            className="cursor-pointer text-xl"
            onClick={() => dispatch(setAllContactsPage())}
          />
          <span>New Chat</span>
        </div>
      </div>
      <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
        <div className="flex py-3 items-center gap-3 h-14">
          <div className="bg-panel-header-background flex items-center gap-5 px-2 py-1 mx-4 rounded-lg flex-grow">
            <div>
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
            </div>
            <div>
              <input
                type="text"
                placeholder="Search contacts"
                className="bg-transparent text-sm focus:outline-none text-white w-full"
                onChange={() => {}}
              />
            </div>
          </div>
        </div>
        {/* TODO: to add loading spinner for allcontacts data */}

        {loading ? (
          <FiLoader
            color={"white"}
            className="animate-spin text-4xl text-center"
          />
        ) : (
          <>
            {Object.entries(allContacts).map(([initialLetter, userList]) => {
              return (
                <div key={Date.now() + initialLetter}>
                  <div className="text-teal-light pl-5 py-5">
                    {initialLetter}
                    {userList.map((contact) => {
                      return (
                        <ChatListItem
                          data={contact}
                          isContactPage={true}
                          key={contact.id}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default ContactsList;
