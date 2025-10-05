// store/slices/cvTemplateSlice.js
import { createSlice } from "@reduxjs/toolkit";

const cvTemplateSlice = createSlice({
    name: "cvTemplate",
    initialState: {
        html: "",
        selectedTemplateId: null,
    },
    reducers: {
        setPreviewHtml: (state, action) => {
            state.html = action.payload;
        },
        setSelectedTemplateId: (state, action) => {
            state.selectedTemplateId = action.payload;
        },
    },
});

export const { setPreviewHtml, setSelectedTemplateId } =
    cvTemplateSlice.actions;
export default cvTemplateSlice.reducer;
