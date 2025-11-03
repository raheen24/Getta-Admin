import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: "",
  isLogin: false,
  fcmToken: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user || null;
      state.token = action.payload.token || "";
      state.isLogin = true;
    },

    setUser: (state, action) => {
      state.user = action.payload || null;
      state.isLogin = !!action.payload;
    },

    setToken: (state, action) => {
      state.token = action.payload || "";
    },

    setLogout: (state) => {
      state.user = null;
      state.isLogin = false;
      state.token = "";
      state.fcmToken = "";
    },

    setDeleteAccount: (state) => {
      state.user = null;
      state.isLogin = false;
      state.token = "";
      state.fcmToken = "";
    },

    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
  },
});

export const {
  setLogin,
  setUser,
  setToken,
  setLogout,
  setFcmToken,
  setDeleteAccount,
} = userSlice.actions;

export default userSlice.reducer;
