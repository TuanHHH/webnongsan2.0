import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./app/appSlice";
//import productSlice from "./product/productSilce";
import storage from "redux-persist/lib/storage"
import {persistReducer, persistStore} from 'redux-persist'
import userSlice from "./user/userSlice";

const commonConfig = {
  key: 'ogani_shop/user',
  storage
}

const userConfig ={
  ...commonConfig,
  whitelist: ['isLoggedIn', 'token','current']
}

export const store = configureStore({
  reducer: {
    app: appSlice,
//    products: productSlice,
    user: persistReducer(userConfig, userSlice)
  },
});


export const persistor = persistStore(store)