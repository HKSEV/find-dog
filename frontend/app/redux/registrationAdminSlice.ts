import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  AdminRegistrationKind,
  AdminRegistrationRow,
  createRegistrationRows,
  getRegistrationSources
} from "@/lib/adminRegistrations";
import { logoutAdmin } from "./adminProfileSlice";

interface RegistrationListState {
  rows: AdminRegistrationRow[];
  status: "idle" | "loading" | "succeeded";
  failedSources: string[];
  currentRequestId: string | null;
}

const createListState = (): RegistrationListState => ({
  rows: [],
  status: "idle",
  failedSources: [],
  currentRequestId: null
});
const initialState: Record<AdminRegistrationKind, RegistrationListState> = {
  recommended: createListState(),
  campaign: createListState(),
  integrate: createListState(),
  shelter: createListState()
};

export const fetchAdminRegistrations = createAsyncThunk(
  "registrationAdmin/fetch",
  async (kind: AdminRegistrationKind, {signal}) => {
    const sources = getRegistrationSources(kind);
    const results = await Promise.allSettled(
      sources.map(async ({key, endpoint}) => {
        const response = await axios.get<unknown>(endpoint, {signal, withCredentials: true, timeout: 15000});
        return createRegistrationRows(kind, key, response.data);
      })
    );
    const rows: AdminRegistrationRow[] = [];
    const failedSources: string[] = [];
    results.forEach((result, index) => {
      if (result.status === "fulfilled") rows.push(...result.value);
      else failedSources.push(sources[index].label);
    });
    rows.sort((a, b) => b.timestamp - a.timestamp || b.id - a.id);
    return {rows, failedSources};
  }
);

const registrationAdminSlice = createSlice({
  name: "registrationAdmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logoutAdmin.fulfilled, () => initialState)
      .addCase(fetchAdminRegistrations.pending, (state, action) => {
        const list = state[action.meta.arg];
        list.status = "loading";
        list.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchAdminRegistrations.fulfilled, (state, action) => {
        const list = state[action.meta.arg];
        if (list.currentRequestId !== action.meta.requestId) return;
        list.rows = action.payload.rows;
        list.failedSources = action.payload.failedSources;
        list.status = "succeeded";
        list.currentRequestId = null;
      })
      .addCase(fetchAdminRegistrations.rejected, (state, action) => {
        const list = state[action.meta.arg];
        if (list.currentRequestId !== action.meta.requestId) return;
        list.currentRequestId = null;
        list.status = action.meta.aborted ? "idle" : "succeeded";
        if (!action.meta.aborted) {
          list.rows = [];
          list.failedSources = getRegistrationSources(action.meta.arg).map(({label}) => label);
        };
      });
  }
});

export default registrationAdminSlice.reducer;
