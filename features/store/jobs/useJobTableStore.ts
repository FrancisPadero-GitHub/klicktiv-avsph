import { create } from "zustand";

interface JobTableStore {
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
}

export const useJobTableStore = create<JobTableStore>((set) => ({
  currentPage: 1,
  setCurrentPage: (page) =>
    set((state) => ({
      currentPage: typeof page === "function" ? page(state.currentPage) : page,
    })),
}));
