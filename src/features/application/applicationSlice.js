import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: "application",
    initialState: {
        applications: [],
        formData: null,
    },
    reducers: {
        setApplications(state, action) {
            state.applications = action.payload;
        },
        setFormData(state, action) {
            state.formData = action.payload;
        },
        clearFormData(state) {
            state.formData = null;
        },
    },
});

export const { setApplications, setFormData, clearFormData } =
    applicationSlice.actions;
export default applicationSlice.reducer;

export const selectApplications = (state) => state.application.applications;
export const selectFormData = (state) => state.application.formData;
