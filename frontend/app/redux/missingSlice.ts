// src/redux/missingSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface MissingAnimal {
  id: number;
  title: string;
  content?: string;
  breed: string;
  status: "MISSING" | "COMPLETED";
  type: "LOST" | "FOUND"; // 잃어버렸어요 / 발견했어요
  occurredAt?: string; // 잃어버린 때 / 발견한 때
  mine?: boolean; // 상세 조회에서 내 글인지 (로그인했을 때만)
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
  myPosts: MissingAnimal[]; // 마이 > 작성한 글
  myPostsLoading: boolean;
  myPostsError: string | null; // "UNAUTHORIZED"면 다시 로그인 필요
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
  detailError: null,
  myPosts: [],
  myPostsLoading: false,
  myPostsError: null
};

const toErrorMessage = (error: unknown, fallback: string) =>
  (axios.isAxiosError<string | {message?: string}>(error) && typeof error.response?.data === "string"
    ? error.response.data
    : undefined) || fallback;

export interface MissingListQuery {
  cursorId?: number; // 이 글보다 오래된 글을 이어서 가져옴
  type?: "LOST" | "FOUND"; // 실종 / 목격 (없으면 전체)
  status?: "MISSING" | "COMPLETED"; // 찾는 중 / 찾았어요 (없으면 전체)
}

// 실종/제보 목록 조회 (거르기는 서버에서)
export const fetchMissingAnimals = createAsyncThunk(
  "missing/fetchMissingAnimals",
  async (query: MissingListQuery | undefined, {rejectWithValue}) => {
    try {
      const response = await axios.get("/api/missing-posts", {
        params: {size: MISSING_PAGE_SIZE, ...(query ?? {})}
      });
      return response.data as MissingAnimal[];
    } catch (error: unknown) {
      return rejectWithValue(toErrorMessage(error, "실종/제보 데이터를 불러오는데 실패했습니다."));
    }
  }
);

// 로그인 토큰이 있으면 같이 보냄 (상세의 mine, 수정·삭제·찾았어요)
export const missingAuthHeader = (): Record<string, string> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? {Authorization: `Bearer ${token}`} : {};
};

// 실종/제보 글 하나 조회 (상세 화면)
export const fetchMissingPost = createAsyncThunk("missing/fetchMissingPost", async (id: number, {rejectWithValue}) => {
  try {
    const response = await axios.get(`/api/missing-posts/${id}`, {headers: missingAuthHeader()});
    return response.data as MissingAnimal;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return rejectWithValue("NOT_FOUND");
    };
    return rejectWithValue(toErrorMessage(error, "글을 불러오지 못했습니다."));
  }
});

// 내가 쓴 실종/제보 글 (로그인 토큰 필요)
export const fetchMyMissingPosts = createAsyncThunk("missing/fetchMyMissingPosts", async (_: void, {rejectWithValue}) => {
  const token = localStorage.getItem("token");
  if (!token) return rejectWithValue("UNAUTHORIZED");

  try {
    const response = await axios.get("/api/missing-posts/mine", {
      headers: {Authorization: `Bearer ${token}`}
    });
    return response.data as MissingAnimal[];
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
      return rejectWithValue("UNAUTHORIZED");
    };
    return rejectWithValue(toErrorMessage(error, "작성한 글을 불러오지 못했습니다."));
  }
});

export const missingSlice = createSlice({
  name: "missing",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMissingAnimals.pending, (state, action) => {
        if (action.meta.arg?.cursorId) {
          state.loadingMore = true;
        } else {
          state.loading = true;
        };
        state.error = null;
      })
      .addCase(fetchMissingAnimals.fulfilled, (state, action) => {
        const isNextPage = Boolean(action.meta.arg?.cursorId);
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

    builder
      .addCase(fetchMyMissingPosts.pending, (state) => {
        state.myPostsLoading = true;
        state.myPostsError = null;
      })
      .addCase(fetchMyMissingPosts.fulfilled, (state, action) => {
        state.myPostsLoading = false;
        state.myPosts = action.payload;
      })
      .addCase(fetchMyMissingPosts.rejected, (state, action) => {
        state.myPostsLoading = false;
        state.myPosts = [];
        state.myPostsError = action.payload as string;
      });
  }
});

export default missingSlice.reducer;
