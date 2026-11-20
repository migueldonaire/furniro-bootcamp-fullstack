import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { api } from "./api";

// All the slices are already registered here
export const rootReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
});
