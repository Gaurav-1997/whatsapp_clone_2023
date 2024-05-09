import {
  FRIEND_REQUEST_ROUTE,
  GET_ALL_CONTACTS,
  GET_PRIVATE_CHATID_ROUTE,
  USER_STATUS_ROUTE,
} from "@/utils/ApiRoutes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userLoading: false,
  userInfo: undefined,
  newUser: false,
  contactsPage: false,
  currentChatUser: undefined,
  currentChatUserStatus: "offline",
  allUsers: [],
  messages: [],
  isLoading: false,
  allContacts: {},
  onlineUsers: [],
  userPendingRequest: [],
  loadingContacts: false,
  toastMessage: "",
  showToastMessage: false,
  showLoadingToast: false,
  toastStatus: "",
  privateChatId: null,
};

export const getAllContacts = createAsyncThunk("getAllContacts", async (id) => {
  try {
    console.log("getAllContacts for id:", id);
    const {
      data: { users },
    } = await axios.get(`${GET_ALL_CONTACTS}/${id}`);
    console.log("getAllContacts", users);
    return users;
  } catch (error) {
    console.log(error);
  }
});

export const getUserStatus = createAsyncThunk(
  "getUserStatus",
  async (params = {}) => {
    try {
      console.log("getUserStatus", params);
      const { data } = await axios.post(`${USER_STATUS_ROUTE}`, { ...params });
      return data;
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
      const { data } = await axios.post(FRIEND_REQUEST_ROUTE, { ...params });
      console.log("sendFriendRequest response:", data);
      return data;
    } catch (error) {
      console.error("Error Friend Request sent", error);
    }
  }
);

export const addOrRejectUser = createAsyncThunk(
  "addOrRejectUser",
  async (params = {}) => {
    try {
      console.log({ ...params });
      const { data } = await axios.patch(FRIEND_REQUEST_ROUTE, { ...params });
      return data;
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
    setUserLoading: (state, action) => {
      console.log("setUserLoading", action.payload);
      state.userLoading = action.payload;
    },
    setLoadingContacts: (state, action) => {
      state.loadingContacts = action.payload; 
    },
    setPrivateChatId: (state, action) => {
      state.privateChatId = action.payload;
    },
    setLastMessageInfo: (state, action)=>{
      // iterate to filter recieverid
      for(let friend of state.userInfo.friends){
        if(friend.id === action.payload.senderId){
          console.log("friend",action.payload)
          friend.chat[0].last_message = action.payload.message.content
          friend.chat[0].last_message_status = action.payload.message.messageStatus
          friend.chat[0].last_message_sender_id = action.payload.senderId
          friend.chat[0].unread_message_count = action.payload.unread_message_count
        }
      }
    }
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
      state.currentChatUserStatus = action.payload.userStatus
      state.privateChatId = action.payload?.privateChat?.chat_id;
    });
    builder.addCase(getUserStatus.rejected, (state, action) => {
      console.error(action.payload);
    });
    builder.addCase(sendFriendRequest.pending, (state) => {
      state.userLoading = true;
      state.showLoadingToast = !state.showLoadingToast;
      state.toastStatus = "loading";
      state.toastMessage = "Sending Request";
    });
    builder.addCase(sendFriendRequest.fulfilled, (state, action) => {
      console.log("fulfilled");
      state.userLoading = false;
      state.userInfo.requestSentTo = action.payload.user.requestSentTo;
      state.showToastMessage = !state.showToastMessage;
      state.toastStatus = "success";
      state.toastMessage = action.payload.message;
    });
    builder.addCase(sendFriendRequest.rejected, (state, action) => {
      state.showToastMessage = !state.showToastMessage;
      state.toastStatus = "error";
      state.showToastMessage = action.payload.message;
    });
    builder.addCase(addOrRejectUser.fulfilled, (state, action) => {
      console.log("addOrRejectUser", action.payload);
      if (action.payload.isAccepted) {
        const replacePendingRequest = state.userInfo.pendingRequest.filter(
          (user) => user.id !== action.payload.requesterData.id
        );
        const addInFriends = state.userInfo.pendingRequest.filter(
          (user) => user.id === action.payload.requesterData.id
        );
        const { pendingRequest, friends, ...rest } = state.userInfo;
        const updatedFriends = [addInFriends[0], ...friends];
        state.userInfo = {
          ...rest,
          friends: updatedFriends,
          pendingRequest: replacePendingRequest,
        };
        state.privateChatId = action.payload.privateChatId;
        state.showToastMessage = !state.showToastMessage;
        state.toastStatus = "success";
        state.toastMessage = action.payload.message;
      } else if (!action.payload.isAccepted) {
        const replacePendingRequest = state.userInfo.pendingRequest.filter(
          (user) => user.id !== action.payload.requesterData.id
        );
        const { pendingRequest, ...rest } = state.userInfo;
        state.userInfo = { ...rest, pendingRequest: replacePendingRequest };
        state.showToastMessage = !state.showToastMessage;
        state.toastStatus = "success";
        state.toastMessage = action.payload.message;
      }
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
  setUserLoading,
  setLoadingContacts,
  setPrivateChatId,setLastMessageInfo
} = userSlice.actions;

export default userSlice.reducer;
