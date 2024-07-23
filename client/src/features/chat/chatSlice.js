import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { socketClient } from "@/pages/_app";
import {
  GET_MESSAGES_ROUTE,
  ADD_MESSAGES_ROUTE,
  ADD_IMAGE_MESSAGE_ROUTE,
  REACTION_MESSAGES_ROUTE,
} from "@/utils/ApiRoutes";
import axios from "axios";

const initialState = {
  messageStatus: "", //ideally it should come from the BE
  messages: [],
  isUserAdded: false,
  isSending: false,
  error: "",
  newMessage: {},
  searchMessage: false,
  chatId: null,
  chatUserId: null,
  lastMessage: null,
  replyEnabled: false,
  parentMessage: null,
  parentMessageId: null,
  fromSelf: true,
  messageToEdit:{}
};

export const addUser = createAsyncThunk("addUser", async (id) => {
  try {
    return await socketClient.emit("add-user", id);
  } catch (error) {
    console.log(error);
  }
});

export const getMessages = createAsyncThunk(
  "getMessages",
  async (params = {}) => {
    try {
      // console.log("getMessages", params);
      const getMessagesURL = `${GET_MESSAGES_ROUTE}/${params.privateChatId}/${params.recieverId}/${params.senderId}`;
      const { data } = await axios.get(getMessagesURL);
      // console.log("data", data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "sendMessage",
  async (postData = {}) => {
    try {
      // console.log("sendMessage", { ...postData });
      const { data } = await axios.post(ADD_MESSAGES_ROUTE, {
        ...postData,
      });
      // console.log("data", data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const sendImageMessage = createAsyncThunk(
  "sendImageMessage",
  async ({ formData, senderId, recieverId }) => {
    try {
      const { data, status } = await axios.post(
        ADD_IMAGE_MESSAGE_ROUTE,
        formData,
        {
          headers: { "Content-Type": "mutli-part/form-data" },
          params: {
            from: senderId,
            to: recieverId,
          },
        }
      );

      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateEmojiReaction = createAsyncThunk(
  "updateEmojiReaction",
  async (reactionData = {}) => {
    try {
      const { data } = await axios.post(REACTION_MESSAGES_ROUTE, {
        ...reactionData,
      });
      console.log("updateEmojiReaction", data);
      return data;
    } catch (error) {}
  }
);

export const editMessage = createAsyncThunk("editMessage", async(editedData)=>{
  try {
    const {data} = await axios.put(ADD_MESSAGES_ROUTE, {...editedData})    
    return data;
  } catch (error) {
    console.error(error)
  }
})

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      // console.log("addMessage", action);
      state.messages.push(action.payload.newMessage);
    },
    setSearchMessage: (state) => {
      state.searchMessage = !state.searchMessage;
      // console.log(state.searchMessage);
    },
    setChatId: (state, action) => {
      state.chatId = action.payload;
    },
    setChatUserId: (state, action) => {
      state.chatUserId = action.payload;
    },
    setReplyEnabled: (state, action) => {
      // state.replyEnabled = action.payload.replyEnabled
      // state.parentMessage = action.payload.parentMessage
      // state.parentMessageId = action.payload.parentMessageId
      return {
        ...state,
        ...action.payload,
      };
    },
    setChatReaction: (state, action) => {
      console.log("setChatReaction", action.payload);
      const index = state.messages.findIndex(
        (message) => message.id === action.payload.reationData.parentMessageId
      );
      let _messages = state.messages[index];
      _messages.reactions = [
        ..._messages.reactions,
        action.payload.reationData,
      ];
      state.messages[index] = _messages;
    },
    setMessageToEdit: (state, action)=>{
      state.messageToEdit = action.payload
    },
    setEditedMessage:(state, action)=>{
      const index = state.messages.findIndex(msg => msg.id===action.payload.id)
      // edited-content      
      state.messages[index].content = action.payload.content
      state.messages[index].isEdited = action.payload.isEdited
      state.messages[index].editedAt = action.payload.editedAt
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addUser.pending, (state) => {
      state.isUserAdded = false;
    });
    builder.addCase(addUser.fulfilled, (state) => {
      state.isUserAdded = true;
    });
    builder.addCase(addUser.rejected, (state) => {
      state.isUserAdded = false;
    });
    builder.addCase(getMessages.pending, (state, action) => {
      state.messages = [];
    });
    builder.addCase(getMessages.fulfilled, (state, action) => {
      state.messages = action.payload.messages;
      state.lastMessage = action.payload.lastMessage;
    });
    builder.addCase(getMessages.rejected, (state, action) => {
      state.messages = [];
    });
    builder.addCase(sendMessage.pending, (state, action) => {
      state.isSending = true;
      // console.log("sendMessage.pending", action.payload);
    });
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      console.log("sendMessage.fulfilled", action.payload);
      state.isSending = false;
      state.messages.push({ ...action.payload.message, fromSelf: true });
    });
    builder.addCase(sendMessage.rejected, (state, action) => {
      if (action?.error?.message === "Rejected") {
        // console.log(action?.payload);
        state.isSending = false;
        state.error = action?.payload || "Something went wrong";
      }
    });
    builder.addCase(sendImageMessage.fulfilled, (state, action) => {
      state.messages.push({ ...action.payload.message, fromSelf: true });
    });
    builder.addCase(updateEmojiReaction.pending, (state, action) => {
      console.log("updateEmojiReaction.pending", action.payload);
    });
    builder.addCase(updateEmojiReaction.fulfilled, (state, action) => {
      const index = state.messages.findIndex(
        (message) => message.id === action.payload.parentMessageId
      );
      let _messages = state.messages[index];
      _messages.reactions = [..._messages.reactions, action.payload];
      state.messages[index] = _messages;
    });
    builder.addCase(updateEmojiReaction.rejected, (state, action) => {
      console.log("updateEmojiReaction.rejected", action.payload);
    });
    builder.addCase(editMessage.fulfilled, (state, action)=>{
      // console.log("editMessage.fulfilled",action.payload)
      const index = state.messages.findIndex(msg => msg.id===action.payload.id)
      // edited-content      
      state.messages[index].content = action.payload.content
      state.messages[index].isEdited = action.payload.isEdited
      state.messages[index].editedAt = action.payload.editedAt      
    })
  },
});

export const {
  addMessage,
  setSearchMessage,
  setChatId,
  setChatUserId,
  setReplyEnabled,
  setChatReaction,
  setMessageToEdit,
  setEditedMessage
} = chatSlice.actions;

export default chatSlice.reducer;
