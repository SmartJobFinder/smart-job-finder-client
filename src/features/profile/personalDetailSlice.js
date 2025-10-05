import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null,
};

const personalDetailSlice = createSlice({
    name: "personalDetail",
    initialState,
    reducers: {
        setPersonalDetail: (state, action) => {
            state.data = action.payload;
        },
        clearPersonalDetail: (state) => {
            state.data = null;
        },
    },
});

export const { setPersonalDetail, clearPersonalDetail } =
    personalDetailSlice.actions;

export const selectPersonalDetail = (state) => state.personalDetail.data;

export default personalDetailSlice.reducer;
