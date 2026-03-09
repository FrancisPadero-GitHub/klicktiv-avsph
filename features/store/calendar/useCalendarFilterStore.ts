import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface CalendarFilterState {
  year: number;
  month: number;
  selectedTechnicians: string[]; // empty means "all"
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  setMonthAndYear: (month: number, year: number) => void;
  toggleTechnician: (techId: string) => void;
  setTechnicians: (techIds: string[]) => void;
  resetFilters: () => void;
}

const currentDate = new Date();

export const useCalendarFilterStore = create<CalendarFilterState>()(
  devtools(
    (set) => ({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      selectedTechnicians: [],
      setYear: (year) => set({ year }),
      setMonth: (month) => set({ month }),
      setMonthAndYear: (month, year) => set({ month, year }),
      toggleTechnician: (techId) =>
        set((state) => {
          const isSelected = state.selectedTechnicians.includes(techId);
          if (isSelected) {
            return {
              selectedTechnicians: state.selectedTechnicians.filter(
                (id) => id !== techId,
              ),
            };
          } else {
            return {
              selectedTechnicians: [...state.selectedTechnicians, techId],
            };
          }
        }),
      setTechnicians: (techIds) => set({ selectedTechnicians: techIds }),
      resetFilters: () =>
        set({
          year: new Date().getFullYear(),
          month: new Date().getMonth(),
          selectedTechnicians: [],
        }),
    }),
    {
      name: "calendar-filter-storage",
    },
  ),
);
