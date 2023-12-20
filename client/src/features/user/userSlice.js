import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  userInfo: undefined,
  newUser: false,
  contactsPage: false,
  currentChatUser: undefined,
  allUsers: [],
  messages: [],
  socket: undefined,
};

export const userSlice = createSlice({
  name: "userInfo",
  initialState,

  //reducers contain properties and functions
  reducers: {
    setUser: (state, action) => {
      // console.log(action.payload);
      state.userInfo = action.payload;
    },
    setNewUser: (state, action) => {
      state.newUser = action.payload;
    },
    setAllContactsPage: (state, action) => {
      state.contactsPage = !state.contactsPage;
      // this can be done in below steps also
      // return {
      //   ...state,
      //   contactsPage: !state.contactsPage
      // }
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
    setSocket: (state, action) => {
      // console.log("Socket from userSlice", state.socket);
      // console.log("Socket from userSlice", action);
      state.socket = action.payload;
    },
    addMessage: (state, action) => {
      // state.messages.push(action.payload);
      // console.log("Socket from userSlice", action.payload);
      state.messages = [...state.messages, action.payload.newMessage];
    },
  },
});

export const {
  setUser,
  setNewUser,
  setAllContactsPage,
  setCurrentChatUser,
  setAllUsers,
  setMessages,
  setSocket,
  addMessage,
} = userSlice.actions;

export default userSlice.reducer;
