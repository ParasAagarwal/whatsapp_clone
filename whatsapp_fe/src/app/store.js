import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createFilter from "redux-persist-transform-filter";
import storage from "redux-persist/lib/storage";
// Slices
import userSlice from "../features/userSlice";
import chatSlice from "../features/chatSlice";

// Filter to persist only the 'user' field from the 'user' slice
const saveUserOnlyFilter = createFilter("user", ["user"]);

// Configuration for redux-persist
const persistConfig = {
  key: "user", // Key for storing persisted data
  storage, // Storage mechanism (localStorage in this case)
  whitelist: ["user"], // Specify which slices to persist
  transforms: [saveUserOnlyFilter], // Apply filter to save only certain fields
};

// Combine reducers
const rootReducer = combineReducers({
  user: userSlice,
  chat: chatSlice,
});

// Apply persistence to the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable certain Redux Toolkit checks for serializable actions
    }),
  devTools: true, // Enable Redux DevTools
});

// Create the persistor to handle rehydration
export const persister = persistStore(store);
