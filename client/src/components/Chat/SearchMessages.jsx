import React from "react";
import { setSearchMessage } from "@/features/chat/chatSlice";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "../Chatlist/SearchBar";
import { calculateTime } from "@/utils/CalculateTime";

function SearchMessages() {
  const dispatch = useDispatch();
  const [searchTerm, setSearch] = React.useState("")
  const [searchMessages, setSearchMessages] = React.useState([])
  const { currentChatUser } = useSelector((reduxState) => reduxState.userReducer);
  const { messages } = useSelector((reduxState) => reduxState.chatReducer);

  React.useEffect(()=>{
    if(searchTerm){
      setSearchMessages(messages.filter(message=> message.type==="text" 
      && message.message.includes(searchTerm)))
    }else{
      setSearchMessages([])
    }
  },[searchTerm])

  return <div className="w-full border-conversation-border border-l bg-conversation-panel-background">
    <div className="h-16 px-4 py-5 flex gap-10 items-center bg-panel-header-background">
      <IoClose fill="white" className="cursor-pointer" onClick={() => dispatch(setSearchMessage())} />
      <span className="text-icon-green text-lg">Search Messages</span>
    </div>
    <SearchBar placeholder="Search Messages" searchTerm={searchTerm} setSearch={setSearch} filterRequired={false} />

    <div className="overflow-auto custom-scrollbar h-full">
      <div className="flex item-center flex-col w-full">
        <div className="flex px-5 items-center gap-3 h-14 w-full">
          <span className="mt-10 text-secondary">
            {!searchTerm.length && `Search for messages with ${currentChatUser.name}`}
          </span>
          <div className="flex justify-center h-full flex-col">
            {searchTerm.length > 0 && !searchMessages.length &&
              <span className="text-secondary w-full flex justify-center">No Messages Found</span>
            }
          </div>

          <div className="flex flex-col w-full h-full">
            {searchMessages?.map((message) =>
              <div className="flex cursor-pointer flex-col justify-center hover:bg-background-default-hover w-full px-5 border-b-[.1px] border-secondary py-5">
                <div className="text-sm text-secondary">
                  {calculateTime(message.createdAt)}
                </div>
                <div className="text-icon-green">{message.message}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>;
}

export default React.memo(SearchMessages);
