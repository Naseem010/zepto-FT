import { combineReducers } from "@reduxjs/toolkit";
import mailReducer from "../slices/mailSlice"


const rootReducer = combineReducers({
    mailList : mailReducer,
});

export default rootReducer;