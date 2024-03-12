import { configureStore} from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import socketReducer from "../features/socket/socketSlice"
import chatReducer from "@/features/chat/chatSlice"

const store = configureStore({
  reducer: {userReducer, socketReducer,chatReducer},
});

export default store;
