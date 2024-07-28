import { setReplyEnabled } from '@/features/chat/chatSlice'
import React from 'react'
import { RxCross2 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux'

const ReplyingFor = (props) => {
    const {parentMessageId, parentMessage, fromSelf} = props;
    const dispatch = useDispatch();
    const {currentChatUser} = useSelector(reduxState=> reduxState.userReducer);
  return (
    <div className="bg-panel-header-background flex transition ease-in-out duration-500">
    <div className="container m-2 p-4 flex rounded-lg bg-slate-800">
      <div
        className="w-2 h-[100%] bg-green-500 rounded-sm"
        style={{ width: "5px" }}
      ></div>
      <div
        className="flex flex-col mx-1"
        href={`#${parentMessageId}`}
        target="_self"
      >
        <span className="text-[#1cc9a9] font-bold">
          {fromSelf ? "You" : currentChatUser?.name}
        </span>
        <span className="text-[#ffffff]">{parentMessage}</span>
      </div>
    </div>
    <button
      onClick={() =>
        dispatch(
          setReplyEnabled({
            replyEnabled: false,
            parentMessage: null,
            parentMessageId: null,
            fromSelf:false
          })
        )
      }
      className="p-2 text-panel-header-icon font-extrabold"
    >
      <RxCross2 className="size-8" />
    </button>
  </div>
  )
}

export default ReplyingFor