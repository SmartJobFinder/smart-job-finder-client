export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => !!state.auth.user;
export const selectAuthHydrated = (state) => state.auth.hydrated;
export const selectAuthRole = (state) => state.auth.user?.role || null;
