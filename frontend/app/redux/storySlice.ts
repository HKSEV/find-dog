// src/redux/storySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// 💡 커뮤니티 탭 (이야기 / 질문·정보 / 나눔)
// 회원 글(입양 후기 등)은 아직 백엔드가 없어서, 관리자가 등록하는 영상(유튜브)과 보호소 소식(펠로우 소식)만 불러옴

export interface StoryVideo {
  id: number;
  title: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  insertDt: string;
}

export interface ShelterNews {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  insertDt: string;
}

export const communityTabs = ["이야기", "질문·정보", "나눔"] as const;
export const storyCategories = ["전체", "입양 후기", "임시보호 일기", "구조 이야기", "보호소 소식", "영상"] as const;

export type CommunityTab = (typeof communityTabs)[number];
export type StoryCategory = (typeof storyCategories)[number];

interface StoryState {
  activeTab: CommunityTab;
  category: StoryCategory;
  videos: StoryVideo[];
  news: ShelterNews[];
  loading: boolean;
  error: string | null;
}

const initialState: StoryState = {
  activeTab: "이야기",
  category: "전체",
  videos: [],
  news: [],
  loading: true,
  error: null
};

// 영상과 보호소 소식을 함께 불러오는 비동기 Thunk
export const fetchStoryContents = createAsyncThunk("story/fetchStoryContents", async (_, {rejectWithValue}) => {
  try {
    const [videoRes, newsRes] = await Promise.all([fetch("/api/youtube"), fetch("/api/fellow-news")]);
    if (!videoRes.ok || !newsRes.ok) {
      throw new Error("이야기를 불러오지 못했습니다.");
    };
    const [videos, news]: [StoryVideo[], ShelterNews[]] = await Promise.all([videoRes.json(), newsRes.json()]);
    return {videos, news};
  } catch (error: unknown) {
    return rejectWithValue(error instanceof Error ? error.message : "이야기를 불러오지 못했습니다.");
  }
});

export const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<CommunityTab>) => {
      state.activeTab = action.payload;
    },
    setCategory: (state, action: PayloadAction<StoryCategory>) => {
      state.category = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoryContents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoryContents.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload.videos;
        state.news = action.payload.news;
      })
      .addCase(fetchStoryContents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {setActiveTab, setCategory} = storySlice.actions;
export default storySlice.reducer;
