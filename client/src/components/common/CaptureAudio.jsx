import React from "react";
import { FaTrash } from "react-icons/fa";

function CaptureAudio({hide}) {
  
  return <div className="flex text-2xl w-full justify-end items-center">
    <div className="pt-1 bg-teal-800 p-3 rounded-lg cursor-pointer">
      <FaTrash className="text-panel-header-icon" fill="white" onClick={()=>hide()} />
    </div>
  </div>;
}

export default CaptureAudio;
