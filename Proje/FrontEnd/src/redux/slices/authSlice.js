import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { companyAuth, userAuth } from "../../services/api";

// Helper function to decode JWT token
function decodeToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch {
    return null;
  }
}

// Load session from localStorage on initialization
function loadSession() {
  const token = localStorage.getItem("tb_token");
  if (!token) return { user: null, token: null };

  const payload = decodeToken(token);
  if (!payload) return { user: null, token: null };

  // Check if token is expired
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    localStorage.removeItem("tb_token");
    localStorage.removeItem("tb_user");
    return { user: null, token: null };
  }

  return {
    token,
    user: {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    },
  };
}

const authEndpoints = {
  company: companyAuth,
  user: userAuth,
};

// Async thunks for login and registration
export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ role, email, password }, { rejectWithValue }) => {
    try {
      const endpoint = authEndpoints[role];
      if (!endpoint) throw new Error("Geçersiz rol");
      const data = await endpoint.login(email, password);
      return { token: data.token, role };
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

// Registration thunk (if needed, can be expanded with more fields)
export const registerThunk = createAsyncThunk(
  "auth/register",
  async ({ role, formData }, { rejectWithValue }) => {
    try {
      const endpoint = authEndpoints[role];
      if (!endpoint) throw new Error("Geçersiz rol");
      const data = await endpoint.register(formData);
      return { token: data.token, role };
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

// Helper function to set session from token
function setSessionFromToken(state, token, fallbackRole) {
  const payload = decodeToken(token);
  if (!payload) return;

  state.token = token;
  state.user = {
    id: payload.id,
    name: payload.name,
    email: payload.email,
    role: payload.role || fallbackRole,
  };

  localStorage.setItem("tb_token", token);
  localStorage.setItem("tb_user", JSON.stringify(state.user));
}

const initialSession = loadSession();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialSession.user,
    token: initialSession.token,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("tb_token");
      localStorage.removeItem("tb_user");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        setSessionFromToken(state, action.payload.token, action.payload.role);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        setSessionFromToken(state, action.payload.token, action.payload.role);
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
