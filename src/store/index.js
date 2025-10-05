import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "@/features/profile/profileSlice";
import authReducer from "@/features/auth/authSlice";
import applicationReducer from "@/features/application/applicationSlice";
import { jobApi } from "@/services/jobService";
import toastSlice from "../store/slices/toastSlices";
import { profileApi } from "@/services/profileService";
import { applicationApi } from "@/services/applicationService";
import { savedCompaniesApi } from "@/services/savedCompaniesService";
import cvTemplateReducer from "@/features/templateCv/cvTemplateSlice"; 
import { cvTemplateApi } from "@/services/cvTemplateService";
import { attachStore } from "@/lib/api";
import personalDetailReducer from "@/features/profile/personalDetailSlice";
import { savedJobApi } from "@/services/savedJobService";
import loginPromptReducer from "@/features/auth/loginPromptSlice";
import { locationApi } from "@/services/locationService";
import { filterApi } from "@/services/filterService";
import { followCompanyApi } from "@/services/followCompanyService";
import { interviewApi } from "@/services/interviewService";

export const store = configureStore({
    reducer: {
        profile: profileReducer,
        personalDetail: personalDetailReducer,
        auth: authReducer,
        application: applicationReducer,
        toast: toastSlice,
        cvTemplate: cvTemplateReducer,
        loginPrompt: loginPromptReducer,
        [cvTemplateApi.reducerPath]: cvTemplateApi.reducer,
        [savedJobApi.reducerPath]: savedJobApi.reducer,
        [jobApi.reducerPath]: jobApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [applicationApi.reducerPath]: applicationApi.reducer,
        [savedCompaniesApi.reducerPath]: savedCompaniesApi.reducer,
        [savedJobApi.reducerPath]: savedJobApi.reducer,
        [locationApi.reducerPath]: locationApi.reducer,
        [filterApi.reducerPath]: filterApi.reducer,
        [followCompanyApi.reducerPath]: followCompanyApi.reducer,
        [interviewApi.reducerPath]: interviewApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    "persist/PERSIST",
                    "persist/REHYDRATE",

                    "cvTemplateApi/executeMutation/pending",
                    "cvTemplateApi/executeMutation/fulfilled",
                    "cvTemplateApi/executeMutation/rejected",

                    "cvTemplateApi/executeQuery/fulfilled",
                    "cvTemplateApi/executeQuery/pending",
                    "cvTemplateApi/executeQuery/rejected",
                ],
                ignoredActionsPaths: ["payload", "meta.baseQueryMeta"],
                ignoredPaths: ["cvTemplateApi"],
            },
        }).concat(
            jobApi.middleware,
            profileApi.middleware,
            applicationApi.middleware,
            savedCompaniesApi.middleware,
            cvTemplateApi.middleware,
            savedJobApi.middleware,
            locationApi.middleware,
            filterApi.middleware,
            followCompanyApi.middleware,
            interviewApi.middleware
        ),
});

attachStore(store);
