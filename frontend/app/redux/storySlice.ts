// src/redux/storySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// 💡 커뮤니티 탭: 분류 칩 하나로 모두 봄
// 관리자 글(보호소 소식, 보호소 영상)은 여기서 불러오고, 회원 글(자유 이야기, 입양 후기, 구조 이야기, 질문)은 story/communityApi.ts에서 불러옴

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
  videoUrl?: string | null;
  attachmentUrl?: string | null;
  insertDt: string;
}

// 질문·정보, 나눔 상단 탭과 임시보호 일기는 뺌 (질문은 칩으로, 나머지는 필요하면 다시)
export const storyCategories = ["전체", "자유 이야기", "입양 후기", "구조 이야기", "질문", "보호소 소식", "보호소 영상"] as const;

export type StoryCategory = (typeof storyCategories)[number];

interface StoryState {
  category: StoryCategory;
  videos: StoryVideo[];
  news: ShelterNews[];
  loading: boolean;
  error: string | null;
}

const initialState: StoryState = {
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

export const {setCategory} = storySlice.actions;
export default storySlice.reducer;
