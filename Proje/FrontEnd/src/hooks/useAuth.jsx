import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { loginThunk, registerThunk, logout as logoutAction, clearError } from "../redux/slices/authSlice";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  const login = useCallback(
    (role, email, password) => dispatch(loginThunk({ role, email, password })).unwrap(),
    [dispatch],
  );

  const register = useCallback(
    (role, formData) => dispatch(registerThunk({ role, formData })).unwrap(),
    [dispatch],
  );

  const logout = useCallback(() => dispatch(logoutAction()), [dispatch]);

  const resetError = useCallback(() => dispatch(clearError()), [dispatch]);

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    resetError,
  };
}
