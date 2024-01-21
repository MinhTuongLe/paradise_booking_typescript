"use client";

import { createSlice } from "@reduxjs/toolkit";
// import { HYDRATE } from "next-redux-wrapper";

// Initial state
const initialState = {
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
    setAuthState(state, action) {
      state.authState = action.payload;
    },
    setLoggUser(state, action) {
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
