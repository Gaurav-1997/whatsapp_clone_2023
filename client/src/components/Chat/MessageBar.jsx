import React, { useRef, useState, useEffect, memo } from "react";
import dynamic from "next/dynamic";
import { BsEmojiSmile } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { FaMicrophone } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, sendImageMessage } from "@/features/chat/chatSlice"
import PhotoPicker from "../common/PhotoPicker";
import CaptureAudio from "../common/CaptureAudio";

const EmojiPicker = dynamic(() => import("emoji-picker-react"));

function MessageBar() {
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showAudioRecorder, setAudioRecorder] = useState(false);

  useEffect(() => {
    const checkPress = (event) => {
      if (event.key === "/") {
        inputRef.current.focus();
        inputRef.current.value = message;
      }
    };

    window.addEventListener("keydown", checkPress);
    return () => {
      window.removeEventListener("keydown", checkPress);
    };
  }, []);

  useEffect(() => {
    const handleClickOutsideEmojiPicker = (event) => {
      if (event.target.id !== "emoji-open") {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target)
        ) {
          setShowEmojiPicker(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutsideEmojiPicker);
    return () => {
      document.removeEventListener("click", handleClickOutsideEmojiPicker);
    };
  }, []);

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => (prev += emoji.emoji));
  };

  const handleDocClick = (event) => {
    setGrabPhoto(true);
  };

  const dispatch = useDispatch();
  const { userInfo, currentChatUser } = useSelector((state) => state.userReducer);

  const handleSendMessage = () => {
    dispatch(sendMessage({ senderId: userInfo?.id, recieverId: currentChatUser?.id, message }))
    setMessage("");
  };

  const photoPickerChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("image", file);
      dispatch(sendImageMessage({ formData, senderId: userInfo?.id, recieverId: currentChatUser?.id }))
    } catch (error) {
      console.log(error);
    }

  };

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      { !showAudioRecorder && 
      <>
        <div className="flex gap-6">
          <BsEmojiSmile
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Emoji"
            id="emoji-open"
            onClick={handleEmojiModal}
          />
          {showEmojiPicker && (
            <div
              className="absolute bottom-24 left-16 z-40"
              ref={emojiPickerRef}
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
            </div>
          )}
          <ImAttachment
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Attach files"
            onClick={handleDocClick}
          />
        </div>
        <div className="w-full rounded-lg h-10 flex items-center">
          <input
            type="text"
            placeholder="Type message"
            className="bg-input-background text-sm focus:border-green-200 focus:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#08f,0_0_15px_#08f,0_0_30px_#08f] text-white h-10 rounded-lg px-5 py-4 w-full"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            ref={inputRef}
            onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); handleSendMessage() } }}
          />
        </div>
        <div className="flex w-10 items-center justify-center">
          {/* send message button */}
          <button className="bg-teal-800 p-2 rounded-lg">
            {message.length ?
              <MdSend
                className="text-panel-header-icon cursor-pointer text-xl"
                title="Send Message"
                fill="white"
                onClick={handleSendMessage}
              /> :
              <FaMicrophone
                className="text-panel-header-icon cursor-pointer text-xl"
                title="Record"
                fill="white"
                onClick={()=>{setAudioRecorder(true)}}
              />
            }
          </button>
        </div>
      </>
      }
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
      {showAudioRecorder && <CaptureAudio hide={setAudioRecorder}/>}
    </div>
  );
}

export default memo(MessageBar);
