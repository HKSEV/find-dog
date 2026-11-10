import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "@/lib/adminApi";
import { adminSessionCleared } from "./adminSessionActions";
import {
  createDashboardData,
  dashboardSources,
  DashboardData,
  DashboardRecord,
  DashboardSource
} from "@/lib/adminDashboard";

interface DashboardAdminState {
  data: DashboardData;
  status: "idle" | "loading" | "succeeded" | "failed";
  failedSources: DashboardSource[];
  updatedAt: string | null;
  currentRequestId: string | null;
}

const initialState: DashboardAdminState = {
  data: createDashboardData(),
  status: "idle",
  failedSources: [],
  updatedAt: null,
  currentRequestId: null
};

export const fetchDashboard = createAsyncThunk("dashboardAdmin/fetchDashboard", async (_, {signal}) => {
  const results = await Promise.allSettled(
    dashboardSources.map(async ({endpoint}) => {
      const response = await adminApi.get<DashboardRecord[]>(endpoint, {signal, timeout: 15000});
      if (!Array.isArray(response.data)) throw new Error("목록 응답이 올바르지 않습니다.");
      return response.data.map(({id, title, insertDt, createdAt}) => ({id, title, insertDt, createdAt}));
    })
  );
  const data = createDashboardData();
  const failedSources: DashboardSource[] = [];

  results.forEach((result, index) => {
    const {key} = dashboardSources[index];
    if (result.status === "fulfilled") {
      data[key] = result.value;
    } else {
      failedSources.push(key);
    };
  });

  return {data, failedSources, updatedAt: new Date().toISOString()};
});

const dashboardAdminSlice = createSlice({
  name: "dashboardAdmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(adminSessionCleared, () => initialState)
      .addCase(fetchDashboard.pending, (state, action) => {
        state.status = "loading";
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.data = action.payload.data;
        state.failedSources = action.payload.failedSources;
        state.updatedAt = action.payload.updatedAt;
        state.status = "succeeded";
        state.currentRequestId = null;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.status = action.meta.aborted ? "idle" : "failed";
        state.failedSources = action.meta.aborted ? [] : dashboardSources.map(({key}) => key);
        if (!action.meta.aborted) {
          state.data = createDashboardData();
          state.updatedAt = null;
        };
        state.currentRequestId = null;
      });
  }
});

export default dashboardAdminSlice.reducer;
