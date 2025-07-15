import {configureStore} from "@reduxjs/toolkit";
import backendSlice from "./features/backendSlice.js";

export const store = configureStore({
    reducer : {
        backend : backendSlice
    }
});