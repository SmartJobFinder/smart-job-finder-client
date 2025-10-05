import { create } from "zustand";

export const useJobSearchStore = create((set) => ({
  searchTerm: "",
  filters: {
    categories: [],
    levels: [],
    workTypes: [],
    skills: [],
  },
  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilters: (filters) => set({ filters }),
}));