import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "@/services/authService";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.user;
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status || 401,
        message: err.response?.data?.message || "Đăng nhập thất bại",
        email: credentials?.email,
      });
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
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
      await authService.logout();
      return { message: "Đăng xuất thành công" };
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
      const response = await authService.me();
      return response.user;
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status || 500,
        message:
          err.response?.data?.message || "Không thể lấy thông tin người dùng",
      });
    }
  }
);
