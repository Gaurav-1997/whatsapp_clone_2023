import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { socketClient } from "@/pages/_app";
import {
  GET_MESSAGES_ROUTE,
  ADD_MESSAGES_ROUTE,
  ADD_IMAGE_MESSAGE_ROUTE,
  USER_STATUS_ROUTE,
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
      const getMessagesURL = `${GET_MESSAGES_ROUTE}/${params.senderId}/${params.recieverId}`;
      const { data } = await axios.get(getMessagesURL);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

const socketEmit = async (params = {}) => {
  try {
    console.log("params", params);
    return await socketClient.emit("send-msg", {
      to: params.recieverId,
      from: params.senderId,
      message: params.newMessage,
    });
  } catch (error) {
    console.error(error);
  }
};

const socketEmitFriendRequest = async (params = {}) => {
  try {
    console.log(params);
    /**
     {"senderId": number,"receiverId": number}
     * 
     */
    return await socketClient.emit("friend-request-sent", params);
  } catch (error) {
    console.log("Error socketEmitFriendRequest", error);
  }
};

export const sendMessage = createAsyncThunk(
  "sendMessage",
  async (postData = {}) => {
    try {
      const { data } = await axios.post(ADD_MESSAGES_ROUTE, {
        to: postData.recieverId,
        from: postData.senderId,
        message: postData.message,
      });
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

      console.log("sendImageMessage: ", data);
      if (status === 201) {
        socketEmit({ recieverId, senderId, newMessage: data.message });
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

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
      console.log(state.searchMessage);
    },
    setChatId: (state, action) => {
      state.chatId = action.payload;
    },
    setChatUserId: (state, action) => {
      state.chatUserId = action.payload;
    },
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
    });
    builder.addCase(getMessages.rejected, (state, action) => {
      state.messages = [];
    });
    builder.addCase(sendMessage.pending, (state, action) => {
      state.isSending = true;
      // console.log("sendMessage.pending", action.payload);
    });
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      // console.log("sendMessage.fulfilled", action.payload)
      state.isSending = false;
      state.messages.push({ ...action.payload.message, fromSelf: true });
    });
    builder.addCase(sendMessage.rejected, (state, action) => {
      if (action?.error?.message === "Rejected") {
        console.log(action?.payload);
        state.isSending = false;
        state.error = action?.payload || "Something went wrong";
      }
    });
    builder.addCase(sendImageMessage.fulfilled, (state, action) => {
      state.messages.push({ ...action.payload.message, fromSelf: true });
    });
  },
});

export const { addMessage, setSearchMessage, setChatId, setChatUserId } = chatSlice.actions;

export default chatSlice.reducer;
