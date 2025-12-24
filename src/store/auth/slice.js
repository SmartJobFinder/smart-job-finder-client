import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, logoutThunk, getMeThunk, registerThunk } from "./thunks";

// Trạng thái ban đầu với người dùng đã đăng nhập mặc định
export const initialState = {
  user: {
    id: 1,
    name: "Võ Nhật Hào",
    email: "vo.nhat.hao@example.com",
    role: "CANDIDATE",
    avatar: "/mock-images/avatars/user1.jpg",
    isActive: true,
  },
  loading: false,
  error: null,
  hydrated: true,
  isLoggedIn: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setHydrated: (state, action) => {
      state.hydrated = action.payload;
    },
  },
  extraReducers: builder => {
    // Login
    builder.addCase(loginThunk.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isLoggedIn = true;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isLoggedIn = false;
    });

    // Logout
    builder.addCase(logoutThunk.pending, state => {
      state.loading = true;
    });
    builder.addCase(logoutThunk.fulfilled, state => {
      state.loading = false;
      state.user = null;
      state.isLoggedIn = false;
    });
    builder.addCase(logoutThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get Me
    builder.addCase(getMeThunk.pending, state => {
      state.loading = true;
    });
    builder.addCase(getMeThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isLoggedIn = true;
    });
    builder.addCase(getMeThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isLoggedIn = false;
    });

    // Register
    builder.addCase(registerThunk.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerThunk.fulfilled, state => {
      state.loading = false;
    });
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError, setHydrated } = authSlice.actions;

export default authSlice.reducer;
