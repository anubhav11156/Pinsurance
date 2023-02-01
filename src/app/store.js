import {configureStore } from '@reduxjs/toolkit'
import accountDetailReducer from '../features/AccountDetailSlice';

export const store = configureStore({
    reducer: {
        accountDetail:accountDetailReducer
    }   
})