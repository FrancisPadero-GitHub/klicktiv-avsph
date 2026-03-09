import { create } from "zustand";

interface ReviewTableStore {
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
}

export const useReviewTableStore = create<ReviewTableStore>((set) => ({
  currentPage: 1,
  setCurrentPage: (page) =>
    set((state) => ({
      currentPage: typeof page === "function" ? page(state.currentPage) : page,
    })),
}));
