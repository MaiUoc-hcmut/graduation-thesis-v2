import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './features/authSlice';
import documentReducer from './features/documentSlice';
import studentReducer from './features/studentSlice';
import { TypedUseSelectorHook, useSelector } from "react-redux";

const rootReducer = combineReducers({
    authReducer: persistReducer({ key: 'authReducer', storage }, authReducer),
    documentReducer: persistReducer({ key: 'documentReducer', storage }, documentReducer),
    studentReducer: persistReducer({ key: 'student', storage }, studentReducer),
})


const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
    reducer: persistedReducer
});


export const persistor = persistStore(store);


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;