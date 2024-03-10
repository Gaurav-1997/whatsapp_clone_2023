import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { socketClient } from "@/pages/_app";
import { GET_MESSAGES_ROUTE, ADD_MESSAGES_ROUTE } from "@/utils/ApiRoutes";

const initialState ={
    messageStatus: '', //ideally it should come from the BE
    messages: [],
    isUserAdded:false
}

export const addUser = createAsyncThunk('addUser',async (id)=>{
    try {
        return await socketClient.emit('add-user', id)
    } catch (error) {
        console.log(error);
    }
})

export const getMessages =createAsyncThunk('getMessages', async(senderId, recieverId)=>{
    try {
        const getMessagesURL = `${GET_MESSAGES_ROUTE}/${senderId}/${recieverId}`;
        const { data } = await axios.get(getMessagesURL);
        return data;
      } catch (error) {
        console.log(error);
      }
})

export const sendMessage = createAsyncThunk('sendMessage', async(senderId, recieverId,message)=>{
    try {
        const { data } = await axios.post(ADD_MESSAGES_ROUTE, {
            to: recieverId,
            from: senderId,
            message: message,
          });
    
          // console.log("socket", socket);
          await socketClient.emit("send-msg", {
            to: recieverId,
            from: senderId,
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
            const newMessage = {...action.payload.message}
            state.messages.push({newMessage, fromSelf:true})
        });
        builder.addCase(sendMessage.fulfilled, (state, action)=>{
            const newMessage = {...action.payload.message}
            state.messages.push({newMessage, fromSelf:true})
        });
        builder.addCase(sendMessage.rejected, (state, action)=>{
            state.messages.push({newMessage, fromSelf:true})
        })
    }
})

// export const {addMessage} = chatSlice.actions;

export default chatSlice.reducer;