import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { companyApi, guideApi, userApi } from "../services/api";
import {
  loginThunk,
  registerThunk,
  logout as logoutAction,
  clearError,
  updateUser as updateUserAction,
} from "../redux/slices/authSlice";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  const syncProfileAfterAuth = useCallback(async (role) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("tb_user") || "null");
      const userId = currentUser?.id;
      if (!userId) return;

      if (role === "guide") {
        const res = await guideApi.getDetail(userId);
        const profile = res?.data ?? res ?? {};
        dispatch(
          updateUserAction({
            name:
              `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
              currentUser?.name ||
              "",
            profileImageUrl: profile.profileImageUrl || null,
          }),
        );
        return;
      }

      if (role === "company") {
        const res = await companyApi.getProfile(userId);
        const profile = res?.data ?? res ?? {};
        dispatch(
          updateUserAction({
            name: profile.name || currentUser?.name || "",
            profileImageUrl: profile.profileImageUrl || null,
          }),
        );
        return;
      }

      if (role === "user") {
        const res = await userApi.getProfile(userId);
        const profile = res?.data ?? res ?? {};
        dispatch(
          updateUserAction({
            name: profile.name || currentUser?.name || "",
            profileImageUrl: profile.profileImageUrl || null,
          }),
        );
      }
    } catch {
      // Non-blocking: login/register should continue even if profile sync fails.
    }
  }, [dispatch]);

  const login = useCallback(
    async (role, email, password) => {
      const result = await dispatch(loginThunk({ role, email, password })).unwrap();
      await syncProfileAfterAuth(result.role || role);
      return result;
    },
    [dispatch, syncProfileAfterAuth],
  );

  const register = useCallback(
    async (role, formData) => {
      const result = await dispatch(registerThunk({ role, formData })).unwrap();
      await syncProfileAfterAuth(result.role || role);
      return result;
    },
    [dispatch, syncProfileAfterAuth],
  );

  const logout = useCallback(() => dispatch(logoutAction()), [dispatch]);

  const resetError = useCallback(() => dispatch(clearError()), [dispatch]);

  const updateUser = useCallback(
    (patch) => dispatch(updateUserAction(patch)),
    [dispatch],
  );

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    resetError,
  };
}
