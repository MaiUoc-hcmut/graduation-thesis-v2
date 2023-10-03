import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/authSlice';
import documentReducer from './features/documentSlice';
import studentReducer from './features/studentSlice';
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        authReducer,
        documentReducer,
        studentReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;