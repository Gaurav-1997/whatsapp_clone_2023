import {
  FRIEND_REQUEST_ROUTE,
  GET_ALL_CONTACTS,
  USER_STATUS_ROUTE,
} from "@/utils/ApiRoutes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userInfo: undefined,
  newUser: false,
  contactsPage: false,
  currentChatUser: undefined,
  currentChatUserStatus: "offline",
  allUsers: [],
  messages: [],
  isLoading: false,
  allContacts: [],
  onlineUsers: [],
  userPendingRequest: [],
};

export const getAllContacts = createAsyncThunk("getAllContacts", async (id) => {
  try {
    // console.log('userInfo.id', id);
    const {
      data: { users },
    } = await axios.get(`${GET_ALL_CONTACTS}/${id}`);
    return users;
  } catch (error) {
    console.log(error);
  }
});

export const getUserStatus = createAsyncThunk(
  "getUserStatus",
  async (userId) => {
    try {
      const {
        data: { userStatus },
      } = await axios.get(`${USER_STATUS_ROUTE}/${userId}`);
      console.log("getUserStatus", userId, userStatus);
      return userStatus;
    } catch (error) {
      console.error("Error getUserStatus", error);
    }
  }
);

export const sendFriendRequest = createAsyncThunk(
  "sendFriendRequest",
  async (params = {}) => {
    try {
      console.log({ ...params });
      const response = await axios.post(FRIEND_REQUEST_ROUTE, { ...params });
      return response;
    } catch (error) {
      console.error("Error Friend Request sent", error);
    }
  }
);

export const userSlice = createSlice({
  name: "userInfo",
  initialState,

  //reducers contain properties and functions
  reducers: {
    setUser: (state, action) => {
      // console.log("setUser", action.payload)
      state.userInfo = action.payload;
    },
    setNewUser: (state, action) => {
      state.newUser = action.payload;
    },
    setAllContactsPage: (state) => {
      state.contactsPage = !state.contactsPage;
    },
    setCurrentChatUser: (state, action) => {
      state.currentChatUser = action.payload;
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload.newMessage);
    },
    setOnlineUsers: (state, action) => {
      console.log("setOnlineUsers", action.payload);
      state.onlineUsers = action.payload;
    },
    setPendingRequest: (state, action) => {
      console.log("userPendingRequest", action.payload);
      state.userPendingRequest = [action.payload, ...state.userPendingRequest];
      console.log("userPendingRequest", state.userPendingRequest);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllContacts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllContacts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.allContacts = action.payload;
    });
    builder.addCase(getAllContacts.rejected, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserStatus.fulfilled, (state, action) => {
      state.currentChatUserStatus = action.payload;
    });
    builder.addCase(getUserStatus.rejected, (state, action) => {
      console.error(action.payload);
    });
  },
});

export const {
  setUser,
  setNewUser,
  setAllContactsPage,
  setCurrentChatUser,
  setAllUsers,
  setMessages,
  addMessage,
  setOnlineUsers,
  setPendingRequest,
} = userSlice.actions;

export default userSlice.reducer;
