import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import List from "./List";
import { useSelector } from "react-redux";
// import ContactsList from "./ContactsList";
import dynamic from "next/dynamic";

const ChatListHeader = dynamic(()=>import('./ChatListHeader'))
const ContactsList = dynamic(()=>import('./ContactsList'))

function ChatList() {
  const {contactsPage} = useSelector((state) => state.userReducer);
  const [pageType, setPageType] = useState("default");

  useEffect(() => {
    if (contactsPage) {
      setPageType("all-contacts");
    } else {
      setPageType("default");
    }
  }, [contactsPage]);
  return (
    <div className="bg-panel-header-background flex flex-col max-h-screen z-20 rounded-l-lg" draggable>
      {pageType === "default"  && (
        <>
          <ChatListHeader />
          <SearchBar filterRequired={true} />
          <List />
        </>
      )}
      {pageType === "all-contacts" && <ContactsList />}
    </div>
  );
}

export default ChatList;
