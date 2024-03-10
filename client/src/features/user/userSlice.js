import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userInfo: undefined,
  newUser: false,
  contactsPage: false,
  currentChatUser: undefined,
  allUsers: [],
  messages: [],
  socket: null,
  isLoading: false,
  allContacts: []
};

export const getAllContacts = createAsyncThunk('getAllContacts', async(id)=>{
  try {
    const {
      data: { users },
    } = await axios.get(`${GET_ALL_CONTACTS}/${id}`);
    return users;
  } catch (error) {
    console.log(error);
  }
})

export const userSlice = createSlice({
  name: "userInfo",
  initialState,

  //reducers contain properties and functions
  reducers: {
    setUser: (state, action) => {
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
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload.newMessage);
    },
  },
  extraReducers : (builder) =>{
    builder.addCase(getAllContacts.pending, (state)=>{
      state.isLoading = true;
    });
    builder.addCase(getAllContacts.fulfilled, (state, action)=>{
      state.isLoading = false;
      state.allContacts = action.payload;
    });
    builder.addCase(getAllContacts.rejected, (state)=>{
      state.isLoading = true;
    });
  }
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
