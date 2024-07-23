import React from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle
} from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import MessageBar from "../Chat/MessageBar";
import MessageContainer from "../Chat/MessageContainer";

const EditMessageModal = (props) => {
  const { isOpen, setEditModalIsOpen } = props;
  const {messageToEdit} = useSelector(reduxState=>reduxState.chatReducer)
  
  return (
    <div className="edit-modal">
      <Dialog
        open={isOpen}
        as="div"
        className="edit-modal relative z-10 focus:outline-none border"
        onClose={setEditModalIsOpen}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-1">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl border-4 border-panel-header-background bg-white/5 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle
                as="h3"
                className="text-xl/8 font-medium text-panel-header-icon flex flex-row items-center px-4 bg-panel-header-background"
              >
                <Button
                  className="mr-6 rounded-full bg-gray-900/50 hover:border-t-2 border-gray-100/10 hover:scale-125 duration-300 "
                  onClick={() => {
                    setEditModalIsOpen(false);
                  }}
    
                >
                  <RxCross2 className="text-panel-header-icon cursor-pointer text-xl"/>
                </Button>
                <b>Edit Message</b>
              </DialogTitle>
              <div className="my-4 px-1">
                <MessageContainer message={messageToEdit} editing={true} />
              </div>
              <div className="mt-4">
                <MessageBar
                  messageBarFor="edited"                
                  editing={true}
                  setEditModalIsOpen={setEditModalIsOpen}
                />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default EditMessageModal;
