import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken:"",
    refreshToken:"",
    user: {},
    isLogin: false,
    userNameChangePassword: "",
  },
  reducers: {
    setLogin(state, action) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload;
      state.refreshToken = action.payload.refreshToken;
      state.isLogin = true;
      Cookies.set("accessToken", action.payload.accessToken);
      Cookies.set("username", action.payload.username);
      Cookies.set("refreshToken", action.payload.refreshToken);
      Cookies.set("roles", action.payload.roles);
    },
    setLogout(state) {
      state.accessToken = "";
      state.user = "";
      state.refreshToken = "";
      state.isLogin = false;
      Cookies.remove("accessToken");
      Cookies.remove("username");
      Cookies.remove("refreshToken");
      Cookies.remove("id");
      Cookies.remove("roles");
    }
  },
  
});

const { reducer, actions } = authSlice;

export const { setUserChangePassword,setLogin ,setLogout } = actions;
export default reducer;