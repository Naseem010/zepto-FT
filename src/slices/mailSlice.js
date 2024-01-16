import { createSlice } from "@reduxjs/toolkit";
import sample_data from "../data/sample_data.json"

// Initial state for the mailList slice
const initialState = {
    allUser : sample_data,
    addedUser : [],
    matchedUser : sample_data.slice(0, Math.min(5, sample_data.length)),
    highlightLastOne : false    
}

// Create the mailList slice using createSlice from Redux Toolkit
export const mailSlice = createSlice({
    name : "mailList",
    initialState : initialState,
    reducers: {
         // Action to filter and set matched users based on the input payload
        setMatchedUser : (state, action) => {
            const filteredResult = state.allUser.reduce((accumulator, user) => {
                if (
                    (user.name.toLowerCase().includes(action.payload.toLowerCase()) ||
                    user.email.toLowerCase().includes(action.payload.toLowerCase())) &&
                    accumulator.length < 5
                ) {
                    accumulator.push(user);
                }
                return accumulator;
            }, []);
            
            // Update the matchedUser in the state
            state.matchedUser = filteredResult;
        },

        addUser : (state, action) => {
            const userId = action.payload;
            const userIndex = state.allUser.findIndex(user => user.id === userId);

            if (userIndex !== -1) {
                const removedUser = state.allUser.splice(userIndex, 1)[0];
                state.addedUser.push(removedUser);
            }

            state.matchedUser = state.allUser.slice(0, Math.min(5, state.allUser.length));
            state.highlightLastOne = false;

        },

        removeUser : (state, action) => {
            const userId = action.payload;

            if (userId === -1) {
                if (state.addedUser.length > 0) {
                    const userIndex = state.addedUser.length - 1;
                    const removedUser = state.addedUser.splice(userIndex, 1)[0];
                    state.allUser.push(removedUser);
                }
            } else {
                const userIndex = state.addedUser.findIndex(user => user.id === userId);
                if (userIndex !== -1) {
                    const removedUser = state.addedUser.splice(userIndex, 1)[0];
                    state.allUser.push(removedUser);
                }
            }

            state.matchedUser = state.allUser.slice(0, Math.min(5, state.allUser.length));
            state.highlightLastOne = false;
        },

        setHighlightLastOne : (state, action) => {
            state.highlightLastOne = action.payload;
        }

    }
})


export const {setMatchedUser, addUser, removeUser, setHighlightLastOne} = mailSlice.actions;
export default mailSlice.reducer