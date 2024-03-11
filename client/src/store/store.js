import {Iterable} from "immutable";
import { configureStore,
  createSerializableStateInvariantMiddleware,
  isPlain } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import socketReducer from "../features/socket/socketSlice"
import chatReducer from "@/features/chat/chatSlice"

const isSerializable = (value) => Iterable.isIterable(value) || isPlain(value)

const getEntries = (value) =>
  Iterable.isIterable(value) ? value.entries() : Object.entries(value)

const serializableMiddleware = createSerializableStateInvariantMiddleware({
  isSerializable,
  getEntries,
})

const store = configureStore({
  reducer: {userReducer, socketReducer,chatReducer},
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck:false}).concat(serializableMiddleware),
});

export default store;
