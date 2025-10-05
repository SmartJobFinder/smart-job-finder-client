import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
    name: "profile",
    initialState: {
        normalizedProfile: null,
        completion: { percent: 0, missingSections: [] },
    },
    reducers: {
        setNormalizedProfile(state, action) {
            state.normalizedProfile = action.payload;
        },
        clearNormalizedProfile(state) {
            state.normalizedProfile = null;
        },
        setCompletion: (state, action) => {
            state.completion = action.payload;
        },
    },
});

export const { setNormalizedProfile, clearNormalizedProfile, setCompletion } =
    profileSlice.actions;

export const selectNormalizedProfile = (state) =>
    state.profile.normalizedProfile;

export const selectProfileCompletion = (state) => state.profile.completion;

export default profileSlice.reducer;
