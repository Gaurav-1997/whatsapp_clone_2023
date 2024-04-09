import React,{useEffect} from "react";
import { setAllContactsPage } from "@/features/user/userSlice";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";

const ChatListItem = dynamic(() => import("./ChatListItem"));

function ContactsList() {
  const { isLoading, allContacts, userInfo } = useSelector(
    (reduxState) => reduxState.userReducer
  );
  const dispatch = useDispatch();

  useEffect(()=>{
    console.log(userInfo.pendingRequest)
  },[])

  return (
    <div className="h-full flex flex-col">
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

        {isLoading ? (
          [...Array(3).keys()].map ((_, idx) => 
            <div key={idx}>
              <div className="shadow rounded-md p-4 max-w-xl w-full m-auto">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-slate-700 h-14 w-14"></div>
                  <div className="flex-1 space-y-6 py-1">
                    <div className="h-6 bg-slate-700 rounded"></div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4 relative">
                        <div className="h-5 bg-slate-700 rounded col-span-2 w-auto"></div>
                        <div className="h-6 w-6 bg-slate-700 rounded-xl col-span-1 absolute right-0"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <>
            {Object.entries(allContacts).map(([initialLetter, userList]) => {
              return (
                <div key={Date.now() + initialLetter}>
                  <div className="text-teal-light pl-2 py-2">
                    {initialLetter}
                    {userList.map((contact) => {
                      console.log("!userInfo.pendingRequest.includes(contact.id)", !userInfo.pendingRequest.includes(contact.id))
                      return (
                        <ChatListItem
                          data={contact}
                          isContactPage={true}
                          key={contact.id}
                          friendRequestBtnRequired={!userInfo.pendingRequest.filter(user=>user.id===contact.id)}
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
