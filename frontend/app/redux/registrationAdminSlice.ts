import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import adminApi from "@/lib/adminApi";
import { adminSessionCleared } from "./adminSessionActions";
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

interface RegistrationTarget {
  kind: AdminRegistrationKind;
  row: AdminRegistrationRow;
}

const registrationEndpoint = (row: AdminRegistrationRow) => `/api/admin/registrations/${row.source}/${row.id}`;

const registrationError = (error: unknown) => {
  if (axios.isAxiosError<string | {message?: string}>(error)) {
    if (error.response?.status === 401) return "관리자로 다시 로그인해 주세요.";
    const data = error.response?.data;
    if (typeof data === "string" && data) return data;
    if (data && typeof data === "object" && data.message) return data.message;
  };
  return "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";
};

export const fetchAdminRegistration = createAsyncThunk(
  "registrationAdmin/fetchOne",
  async ({kind, row}: RegistrationTarget, {rejectWithValue, signal}) => {
    try {
      const response = await adminApi.get<unknown>(registrationEndpoint(row), {timeout: 15000, signal});
      return createRegistrationRows(kind, row.source, [response.data])[0];
    } catch (error: unknown) {
      return rejectWithValue(registrationError(error));
    }
  }
);

export const updateAdminRegistration = createAsyncThunk(
  "registrationAdmin/update",
  async (
    {kind, row, values, imageFile}: RegistrationTarget & {values: Record<string, string>; imageFile: File | null},
    {rejectWithValue}
  ) => {
    try {
      const data = new FormData();
      Object.entries(values).forEach(([key, value]) => data.append(key, value));
      if (imageFile) data.append("imageFile", imageFile);
      const response = await adminApi.put<unknown>(registrationEndpoint(row), data, {timeout: 30000});
      return createRegistrationRows(kind, row.source, [response.data])[0];
    } catch (error: unknown) {
      return rejectWithValue(registrationError(error));
    }
  }
);

export const deleteAdminRegistration = createAsyncThunk(
  "registrationAdmin/delete",
  async ({row}: RegistrationTarget, {rejectWithValue}) => {
    try {
      await adminApi.delete(registrationEndpoint(row), {timeout: 15000});
      return row.key;
    } catch (error: unknown) {
      return rejectWithValue(registrationError(error));
    }
  }
);

export const fetchAdminRegistrations = createAsyncThunk(
  "registrationAdmin/fetch",
  async (kind: AdminRegistrationKind, {signal}) => {
    const sources = getRegistrationSources(kind);
    const results = await Promise.allSettled(
      sources.map(async ({key, endpoint}) => {
        const response = await adminApi.get<unknown>(endpoint, {signal, timeout: 15000});
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
      .addCase(adminSessionCleared, () => initialState)
      .addCase(logoutAdmin.fulfilled, () => initialState)
      .addCase(updateAdminRegistration.fulfilled, (state, action) => {
        const list = state[action.meta.arg.kind];
        const index = list.rows.findIndex(({key}) => key === action.payload.key);
        if (index !== -1) list.rows[index] = action.payload;
        list.rows.sort((a, b) => b.timestamp - a.timestamp || b.id - a.id);
        list.currentRequestId = null;
        list.status = "succeeded";
      })
      .addCase(deleteAdminRegistration.fulfilled, (state, action) => {
        const list = state[action.meta.arg.kind];
        list.rows = list.rows.filter(({key}) => key !== action.payload);
        list.currentRequestId = null;
        list.status = "succeeded";
      })
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
