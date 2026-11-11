"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { setLikedIds, toggleLike } from "../redux/shelterSlice";
import { loadLikedIds, saveLikedIds } from "./animalFormat";

// 💡 관심 동물 (하트). 화면에 들어올 때 브라우저 저장값을 불러오고, 누를 때마다 저장
export const useLikedAnimals = () => {
  const dispatch = useDispatch<AppDispatch>();
  const likedIds = useSelector((state: RootState) => state.shelter.likedIds);

  useEffect(() => {
    dispatch(setLikedIds(loadLikedIds()));
  }, [dispatch]);

  const isLiked = (id: number) => likedIds.includes(id);

  const toggle = (id: number) => {
    const next = isLiked(id) ? likedIds.filter((likedId) => likedId !== id) : [...likedIds, id];
    dispatch(toggleLike(id));
    saveLikedIds(next);
  };

  return {isLiked, toggle};
};
