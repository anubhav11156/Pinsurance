import {configureStore } from '@reduxjs/toolkit'
import accountDetailReducer from '../features/DummySlice';

export const store = configureStore({
    reducer: {
        accountDetai:accountDetailReducer
    }   
})