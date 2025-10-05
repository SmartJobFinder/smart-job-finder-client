import { createSlice } from "@reduxjs/toolkit";
import { savedCompaniesApi } from "@/services/savedCompaniesService";

const savedCompaniesSlice = createSlice({
    name: "savedCompanies",
    initialState: {
        isSaved: false,
        companyId: null,
    },
    reducers: {
        setIsSaved(state, action) {
            state.isSaved = action.payload;
        },
        setCompanyId(state, action) {
            state.companyId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            savedCompaniesApi.endpoints.getSavedCompanies.matchFulfilled,
            (state, { payload }) => {
                state.isSaved = payload.some(
                    (c) => c.companyId === state.companyId
                );
            }
        );
        builder.addMatcher(
            savedCompaniesApi.endpoints.saveCompany.matchFulfilled,
            (state) => {
                state.isSaved = true;
            }
        );
        builder.addMatcher(
            savedCompaniesApi.endpoints.deleteSavedCompany.matchFulfilled,
            (state) => {
                state.isSaved = false;
            }
        );
    },
});

export const { setIsSaved, setCompanyId } = savedCompaniesSlice.actions;
export default savedCompaniesSlice.reducer;
