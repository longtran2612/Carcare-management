import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { authSlice } from "./slices";

const appReducers = combineReducers({ authSlice });

const rootReducer = (state, action) => {
  if (action.type === "RESET_STATE") {
    state = undefined;
  }

  return appReducers(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;