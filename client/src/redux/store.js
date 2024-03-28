import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/user.slice';
import cartReducer from './cart/cartSlice'; 
// import themeReducer from './theme/themeSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import themeReducer from './theme/themSlice';
const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  cart: cartReducer,
  // theme: themeReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);