import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 타입 정의
export interface Campaign {
  id: number;
  title: string;
  hashtag: string;
  content: string;
  thumbnailUrl: string;
  mediaType: string;
  mediaUrl: string;
}

export interface NeedHelp {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
}

interface HomeState {
  campaigns: Campaign[];
  isCampaignsLoading: boolean;
  needHelps: NeedHelp[];
  error: string | null;
}

const initialState: HomeState = {
  campaigns: [],
  isCampaignsLoading: false,
  needHelps: [],
  error: null
};

// 캠페인 목록 (해시태그로 거르기, 빈 값이면 전체)
export const fetchCampaigns = createAsyncThunk("home/fetchCampaigns", async (hashtag: string) => {
  const res = await fetch(`/api/campaigns?hashtag=${encodeURIComponent(hashtag)}`);
  if (!res.ok) throw new Error("캠페인 네트워크 응답이 정상이 아닙니다");
  return (await res.json()) as Campaign[];
});

// 도와주세요 목록 (홈, 입양·봉사 > 함께해요)
export const fetchNeedHelps = createAsyncThunk("home/fetchNeedHelps", async () => {
  const res = await fetch("/api/need-help");
  if (!res.ok) throw new Error("도와주세요 목록을 불러오지 못했습니다");
  return (await res.json()) as NeedHelp[];
});

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // 캠페인
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.isCampaignsLoading = true;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.isCampaignsLoading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.isCampaignsLoading = false;
        state.error = action.error.message || "에러 발생";
      });

    // 도와주세요
    builder.addCase(fetchNeedHelps.fulfilled, (state, action) => {
      state.needHelps = action.payload;
    });
  }
});

export default homeSlice.reducer;
