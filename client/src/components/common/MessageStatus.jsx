import React,{memo} from "react";
import {BsCheck, BsCheckAll} from "react-icons/bs"

function MessageStatus({messageStatus}) {
  // console.log("messageStatus", messageStatus);
  return <>
  {messageStatus === "SENT" && <BsCheck className="text-lg" />}
  {messageStatus === "SEEN" && <BsCheckAll className="text-lg"/>}
  {messageStatus === "READ" && <BsCheckAll className="text-lg text-icon-ack"/>}
  </>;
}

export default memo(MessageStatus);
