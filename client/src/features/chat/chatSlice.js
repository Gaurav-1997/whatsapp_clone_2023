import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { socketClient } from "@/pages/_app";
import { GET_MESSAGES_ROUTE, ADD_MESSAGES_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";

const initialState ={
    messageStatus: '', //ideally it should come from the BE
    messages: [],
    isUserAdded:false,
    isSending:false,
    error:""
}

export const addUser = createAsyncThunk('addUser',async (id)=>{
    try {
        return await socketClient.emit('add-user', id)
    } catch (error) {
        console.log(error);
    }
})

export const getMessages = createAsyncThunk('getMessages', async(params={})=>{
    try {
        const getMessagesURL = `${GET_MESSAGES_ROUTE}/${params.senderId}/${params.recieverId}`;
        const { data } = await axios.get(getMessagesURL);
        return data;
      } catch (error) {
        console.log(error);
      }
})

export const sendMessage = createAsyncThunk('sendMessage', async(postData={})=>{
    try {
        const { data } = await axios.post(ADD_MESSAGES_ROUTE, {
            to: postData.recieverId,
            from: postData.senderId,
            message: postData.message,
          });
    
          await socketClient.emit("send-msg", {
            to: postData.recieverId,
            from: postData.senderId,
            message: data.message,
          })

          return data;
      } catch (error) {
        console.log(error);
      }
})

const chatSlice = createSlice ({
    name:'chat',
    initialState,
    reducers:{
        addMessage: (state, action)=>{
            state.messages.push(action.payload.newMessage);
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(addUser.pending, (state) => {
            state.isUserAdded = false;
        });
        builder.addCase(addUser.fulfilled, (state) => {
            state.isUserAdded = true;
        });
        builder.addCase(addUser.rejected, (state) => {
            state.isUserAdded = false;
        });
        builder.addCase(getMessages.pending, (state, action)=>{
            state.messages =[]
        });
        builder.addCase(getMessages.fulfilled, (state, action)=>{
            state.messages = action.payload.messages
        });
        builder.addCase(getMessages.rejected, (state, action)=>{
            state.messages =[]
        });
        builder.addCase(sendMessage.pending, (state, action)=>{
            state.isSending = true;
            console.log(action.payload);
        });
        builder.addCase(sendMessage.fulfilled, (state, action)=>{
            console.log("sendMessage.fulfilled",action.payload)
            state.isSending = false;
            const newMessage = {...action.payload.message}
            /* new message added in messge state*/
            state.messages.push({newMessage, fromSelf:true})
        });
        builder.addCase(sendMessage.rejected, (state, action)=>{
            if(action?.error?.message === "Rejected"){
                console.log(action?.payload)
                state.isSending = false;
                state.error = action?.payload || 'Something went wrong'
            }
        })
    }
})

export const {addMessage} = chatSlice.actions;

export default chatSlice.reducer;