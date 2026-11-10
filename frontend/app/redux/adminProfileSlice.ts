import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import adminApi from "@/lib/adminApi";
import { adminSessionCleared } from "./adminSessionActions";
import { AdminProfile } from "@/lib/adminProfile";
import { clearAdminSession, getAdminSession, getAdminSessionId } from "@/lib/adminAuth";

interface AdminProfileState {
  profile: AdminProfile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isLoggingOut: boolean;
  currentRequestId: string | null;
}

const initialState: AdminProfileState = {
  profile: null,
  status: "idle",
  error: null,
  isLoggingOut: false,
  currentRequestId: null
};

const getErrorMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError<{message?: string}>(error) ? error.response?.data?.message || fallback : fallback;

export const fetchAdminProfile = createAsyncThunk("adminProfile/fetch", async (_, {signal, rejectWithValue}) => {
  try {
    const response = await adminApi.get<AdminProfile>("/api/admin/profile", {
      signal,
      timeout: 15000
    });
    if (typeof response.data?.name !== "string" || typeof response.data?.email !== "string") {
      throw new Error("회원 정보 응답이 올바르지 않습니다.");
    };
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "회원 정보를 불러오지 못했습니다."));
  }
});

export const logoutAdmin = createAsyncThunk("adminProfile/logout", async (_, {rejectWithValue}) => {
  const session = getAdminSession();
  try {
    await adminApi.post("/api/admin/logout", null, {timeout: 15000});
    const current = getAdminSession();
    if (session && current && getAdminSessionId(session) === getAdminSessionId(current)) {
      clearAdminSession("logout", current.token);
    };
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "로그아웃하지 못했습니다. 잠시 후 다시 시도해 주세요."));
  }
});

const adminProfileSlice = createSlice({
  name: "adminProfile",
  initialState,
  reducers: {
    resetAdminProfile: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminSessionCleared, () => initialState)
      .addCase(fetchAdminProfile.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.profile = action.payload;
        state.status = "succeeded";
        state.currentRequestId = null;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.status = action.meta.aborted ? "idle" : "failed";
        if (!action.meta.aborted) {
          state.profile = null;
          state.error = (action.payload as string) || "회원 정보를 불러오지 못했습니다.";
        };
        state.currentRequestId = null;
      })
      .addCase(logoutAdmin.pending, (state) => {
        state.isLoggingOut = true;
      })
      .addCase(logoutAdmin.fulfilled, () => ({...initialState, status: "failed" as const}))
      .addCase(logoutAdmin.rejected, (state) => {
        state.isLoggingOut = false;
      });
  }
});

export const {resetAdminProfile} = adminProfileSlice.actions;
export default adminProfileSlice.reducer;
