import { createAsyncThunk } from "@reduxjs/toolkit";
import mockApi from "@/mock/api";

export const loginThunk = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            // Sử dụng API giả
            const response = await mockApi.login(credentials);
            return response.data;
        } catch (err) {
            return rejectWithValue({
                status: 401,
                message: err.message || "Đăng nhập thất bại",
                email: credentials?.email,
            });
        }
    }
);

export const registerThunk = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await mockApi.register(userData);
            return response.data;
        } catch (err) {
            return rejectWithValue({
                status: err.response?.status || 500,
                message: err.response?.data?.message || "Đăng ký thất bại",
            });
        }
    }
);

export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await mockApi.logout();
            return response.data;
        } catch (err) {
            return rejectWithValue({
                status: err.response?.status || 500,
                message: err.response?.data?.message || "Đăng xuất thất bại",
            });
        }
    }
);

export const getMeThunk = createAsyncThunk(
    "auth/me",
    async (_, { rejectWithValue }) => {
        try {
            const response = await mockApi.me();
            return response.data;
        } catch (err) {
            return rejectWithValue({
                status: err.response?.status || 500,
                message:
                    err.response?.data?.message ||
                    "Không thể lấy thông tin người dùng",
            });
        }
    }
);
