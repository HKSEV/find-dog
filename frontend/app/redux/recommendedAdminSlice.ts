// src/redux/recommendedAdminSlice.ts
// src/redux/recommendedAdminSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import adminApi from "@/lib/adminApi";
import { adminSessionCleared } from "./adminSessionActions";

interface RecommendedFormState {
  sourceUrl: string;
  region: string;
  noticeNo: string;
  birthYear: string;
  gender: string;
  weight: string;
  imageUrl: string;
}

interface RecommendedAdminState {
  sourceType: "DIRECT" | "FACEBOOK" | "INSTAGRAM";
  formData: RecommendedFormState;
  isParsing: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: RecommendedAdminState = {
  sourceType: "DIRECT",
  formData: {
    sourceUrl: "",
    region: "",
    noticeNo: "",
    birthYear: "",
    gender: "M",
    weight: "",
    imageUrl: ""
  },
  isParsing: false,
  isLoading: false,
  error: null
};

// URL 파싱 비동기 Thunk
export const parseAnimalUrl = createAsyncThunk(
  "recommendedAdmin/parseUrl",
  async ({url, sourceType}: {url: string; sourceType: string}, {rejectWithValue}) => {
    try {
      const response = await adminApi.post("/api/animals/parse-link", {
        url,
        type: sourceType
      });
      return response.data;
    } catch {
      return rejectWithValue("링크 정보를 불러오지 못했습니다. 로그인과 링크 주소를 확인해 주세요.");
    }
  }
);

// 추천 동물 등록 비동기 Thunk
export const submitRecommendedAnimal = createAsyncThunk(
  "recommendedAdmin/submitAnimal",
  async ({sourceType, formData}: {sourceType: string; formData: RecommendedFormState}, {rejectWithValue}) => {
    try {
      const response = await adminApi.post("/api/animals/recommended", {
        sourceType,
        ...formData
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        (axios.isAxiosError<string | {message?: string}>(error) ? error.response?.data : undefined) ||
          "등록에 실패했습니다. 다시 시도해 주세요."
      );
    }
  }
);

export const recommendedAdminSlice = createSlice({
  name: "recommendedAdmin",
  initialState,
  reducers: {
    setSourceType: (state, action: PayloadAction<"DIRECT" | "FACEBOOK" | "INSTAGRAM">) => {
      state.sourceType = action.payload;
    },
    updateRecommendedField: (state, action: PayloadAction<{name: keyof RecommendedFormState; value: string}>) => {
      const {name, value} = action.payload;
      state.formData[name] = value;
    },
    resetRecommendedForm: (state) => {
      state.formData = {
        sourceUrl: "",
        region: "",
        noticeNo: "",
        birthYear: "",
        gender: "M",
        weight: "",
        imageUrl: ""
      };
    }
  },
  extraReducers: (builder) => {
    // 파싱 처리
    builder
      .addCase(adminSessionCleared, () => initialState)
      .addCase(parseAnimalUrl.pending, (state) => {
        state.isParsing = true;
      })
      .addCase(parseAnimalUrl.fulfilled, (state, action) => {
        state.isParsing = false;
        const parsed = action.payload;
        state.formData.region = parsed.region || state.formData.region;
        state.formData.noticeNo = parsed.noticeNo || state.formData.noticeNo;
        state.formData.birthYear = parsed.birthYear || state.formData.birthYear;
        state.formData.gender = parsed.gender || state.formData.gender;
        state.formData.weight = parsed.weight ? String(parsed.weight) : state.formData.weight;
        state.formData.imageUrl = parsed.imageUrl || state.formData.imageUrl;
      })
      .addCase(parseAnimalUrl.rejected, (state) => {
        state.isParsing = false;
      });

    // 최종 등록 처리
    builder
      .addCase(submitRecommendedAnimal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitRecommendedAnimal.fulfilled, (state) => {
        state.isLoading = false;
        state.formData = {
          sourceUrl: "",
          region: "",
          noticeNo: "",
          birthYear: "",
          gender: "M",
          weight: "",
          imageUrl: ""
        };
      })
      .addCase(submitRecommendedAnimal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const {setSourceType, updateRecommendedField, resetRecommendedForm} = recommendedAdminSlice.actions;
export default recommendedAdminSlice.reducer;
