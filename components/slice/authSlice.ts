"use client";

import { User } from "@/models/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { HYDRATE } from "next-redux-wrapper";

export interface AuthState {
  authState: boolean;
  loggedUser: User | null | {};
}

// Initial state
const initialState: AuthState = {
  authState: false,
  loggedUser: {},
};

// Actual Slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset() {
      return initialState;
    },
    setAuthState(state, action: PayloadAction<boolean>) {
      state.authState = action.payload;
    },
    setLoggUser(state, action: PayloadAction<User | null | {}>) {
      state.loggedUser = action.payload;
    },
  },

  // // Special reducer for hydrating the state. Special case for next-redux-wrapper
  // extraReducers: {
  //   [HYDRATE]: (state, action) => {
  //     return {
  //       ...state,
  //       ...action.payload.auth,
  //     };
  //   },
  // },
});

export const { reset, setAuthState, setLoggUser } = authSlice.actions;

export default authSlice.reducer;
