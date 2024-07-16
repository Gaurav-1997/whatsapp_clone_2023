import {
  FRIEND_REQUEST_ROUTE,
  GET_ALL_CONTACTS,
  GET_PRIVATE_CHATID_ROUTE,
  USER_STATUS_ROUTE,
} from "@/utils/ApiRoutes";
import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
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
  async (params = {}) => {
    try {
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
      const { data } = await axios.post(FRIEND_REQUEST_ROUTE, { ...params });
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
      for (let friend of state.userInfo.friends) {
        if (friend.id === action.payload.id) {
          friend.chat[0].unread_message_count = 0;
        }
      }
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
      state.onlineUsers = action.payload;
    },
    setPendingRequest: (state, action) => {
      state.userPendingRequest = [action.payload, ...state.userPendingRequest];
    },
    setUserLoading: (state, action) => {
      state.userLoading = action.payload;
    },
    setLoadingContacts: (state, action) => {
      state.loadingContacts = action.payload;
    },
    setPrivateChatId: (state, action) => {
      state.privateChatId = action.payload;
    },
    setLastMessageInfo: (state, action) => {
      // iterate to filter recieverid
      for (let friend of state.userInfo.friends) {
        if (
          friend.id === action.payload.message.senderId ||
          friend.id === action.payload.message.recieverId
        ) {
          friend.chat[0].last_message = action.payload.message.content;
          friend.chat[0].last_message_status =
            action.payload.message.messageStatus;
          friend.chat[0].last_message_sender_id = action.payload.senderId;
          friend.chat[0].unread_message_count =
            action.payload?.unread_message_count;
          friend.chat[0].fromSelf = action.payload?.message?.fromSelf | false;
        }
      }
    },
    setUserOnTop: (state, action) => {
      if (state.userInfo && state.userInfo.friends) {
        const temp = state.userInfo?.friends.filter(
          (user) => user?.id !== action.payload?.id
        );
        
        const updatedFriends = [state.currentChatUser, ...temp]
        state.userInfo.friends = updatedFriends;    
      }
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
      state.currentChatUserStatus = action.payload.userStatus;
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
  setPrivateChatId,
  setLastMessageInfo,
  setUserOnTop,
} = userSlice.actions;

export default userSlice.reducer;
