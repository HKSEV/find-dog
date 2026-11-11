// src/redux/missingSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface MissingAnimal {
  id: number;
  title: string;
  content?: string;
  breed: string;
  status: "MISSING" | "COMPLETED";
  gender: string;
  age?: string;
  weight?: string;
  color?: string;
  rescueLocation: string;
  authorName?: string;
  createdAt: string;
  mediaUrls?: string[];
}

interface MissingState {
  animalList: MissingAnimal[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean; // 다음 쪽이 더 있는지 (한 번에 MISSING_PAGE_SIZE개씩)
  error: string | null;
  detail: MissingAnimal | null; // 상세 화면에서 보는 글
  detailLoading: boolean;
  detailError: string | null;
}

export const MISSING_PAGE_SIZE = 10;

const initialState: MissingState = {
  animalList: [],
  loading: true,
  loadingMore: false,
  hasMore: false,
  error: null,
  detail: null,
  detailLoading: false,
  detailError: null
};

const toErrorMessage = (error: unknown, fallback: string) =>
  (axios.isAxiosError<string | {message?: string}>(error) && typeof error.response?.data === "string"
    ? error.response.data
    : undefined) || fallback;

// 실종/제보 목록 조회 (cursorId를 주면 그 글보다 오래된 글을 이어서 가져옴)
export const fetchMissingAnimals = createAsyncThunk(
  "missing/fetchMissingAnimals",
  async (cursorId: number | undefined, {rejectWithValue}) => {
    try {
      const response = await axios.get("/api/missing-posts", {
        params: {size: MISSING_PAGE_SIZE, ...(cursorId ? {cursorId} : {})}
      });
      return response.data as MissingAnimal[];
    } catch (error: unknown) {
      return rejectWithValue(toErrorMessage(error, "실종/제보 데이터를 불러오는데 실패했습니다."));
    }
  }
);

// 실종/제보 글 하나 조회 (상세 화면)
export const fetchMissingPost = createAsyncThunk("missing/fetchMissingPost", async (id: number, {rejectWithValue}) => {
  try {
    const response = await axios.get(`/api/missing-posts/${id}`);
    return response.data as MissingAnimal;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return rejectWithValue("NOT_FOUND");
    };
    return rejectWithValue(toErrorMessage(error, "글을 불러오지 못했습니다."));
  }
});

export const missingSlice = createSlice({
  name: "missing",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMissingAnimals.pending, (state, action) => {
        if (action.meta.arg) {
          state.loadingMore = true;
        } else {
          state.loading = true;
        };
        state.error = null;
      })
      .addCase(fetchMissingAnimals.fulfilled, (state, action) => {
        const isNextPage = Boolean(action.meta.arg);
        state.loading = false;
        state.loadingMore = false;
        state.animalList = isNextPage ? [...state.animalList, ...action.payload] : action.payload;
        state.hasMore = action.payload.length === MISSING_PAGE_SIZE;
      })
      .addCase(fetchMissingAnimals.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchMissingPost.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchMissingPost.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload;
      })
      .addCase(fetchMissingPost.rejected, (state, action) => {
        state.detailLoading = false;
        state.detail = null;
        state.detailError = action.payload as string;
      });
  }
});

export default missingSlice.reducer;
