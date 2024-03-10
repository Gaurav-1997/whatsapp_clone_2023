import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { socketClient } from "@/pages/_app";
import { CONNECTED, CONNECTING, CONNECTION_FAILED, DISCONNECTED, DISCONNECTING, DISCONNECTION_FAILED } from "../../utils/SocketStatus"

const initialState = {
    connectionStatus: null | "",
};

export const connectSocket = createAsyncThunk('connectSocket', async function () {
    return await socketClient.connect();
});

export const disconnectFromSocket = createAsyncThunk('disconnectFromSocket', async function () {
    return await socketClient.disconnect();
})

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(connectSocket.pending, (state) => {
            state.connectionStatus = CONNECTING;
        });
        builder.addCase(connectSocket.fulfilled, (state) => {
            state.connectionStatus = CONNECTED;
        });
        builder.addCase(connectSocket.rejected, (state) => {
            state.connectionStatus = CONNECTION_FAILED
        });
        builder.addCase(disconnectFromSocket.pending, (state) => {
            state.connectionStatus = DISCONNECTING;;
        });
        builder.addCase(disconnectFromSocket.fulfilled, (state) => {
            state.connectionStatus = DISCONNECTED;
        });
        builder.addCase(disconnectFromSocket.rejected, (state) => {
            state.connectionStatus = DISCONNECTION_FAILED;
        });

    }
})

export default socketSlice.reducer;