import { createSlice } from "@reduxjs/toolkit";

const loginPromptSlice = createSlice({
    name: "loginPrompt",
    initialState: { open: false },
    reducers: {
        showLoginPrompt: (state) => {
            state.open = true;
        },
        hideLoginPrompt: (state) => {
            state.open = false;
        },
    },
});

export const { showLoginPrompt, hideLoginPrompt } = loginPromptSlice.actions;
export default loginPromptSlice.reducer;
