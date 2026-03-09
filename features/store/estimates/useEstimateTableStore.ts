import { create } from "zustand";

interface EstimateTableStore {
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
}

export const useEstimateTableStore = create<EstimateTableStore>((set) => ({
  currentPage: 1,
  setCurrentPage: (page) =>
    set((state) => ({
      currentPage: typeof page === "function" ? page(state.currentPage) : page,
    })),
}));
