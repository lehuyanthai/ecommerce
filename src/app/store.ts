import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from '../slice/cartSlice'
import userReducer from '../slice/userSlice'
import { persistStore,persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key:'root',
    version:1,
    storage
}

const rootReducer = combineReducers({user:userReducer,cart:cartReducer})

const persistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
    reducer:persistedReducer,
})

export let persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch