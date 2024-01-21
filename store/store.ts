"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "../components/slice/authSlice";
import { persistReducer } from "redux-persist";
import storage from "./storage";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  authSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
