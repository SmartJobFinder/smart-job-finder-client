import { create } from "zustand";

export const useJobSearchStore = create(set => ({
  searchTerm: {
    keyword: "",
    province: "",
    companyName: "",
  },
  filters: {
    categories: [],
    levels: [],
    workTypes: [],
    skills: [],
  },
  setSearchTerm: term => set({ searchTerm: term }),
  setFilters: filters => set({ filters }),
  resetFilters: () =>
    set({
      filters: {
        categories: [],
        workTypes: [],
        levels: [],
        skills: [],
      },
    }),
  resetSearchTerm: () =>
    set({
      searchTerm: {
        keyword: "",
        province: "",
        companyName: "",
      },
    }),
  resetAll: () =>
    set({
      searchTerm: {
        keyword: "",
        province: "",
        companyName: "",
      },
      filters: {
        categories: [],
        workTypes: [],
        levels: [],
        skills: [],
      },
    }),
}));

// "use client";

// import { create } from "zustand";

// export const useJobSearchStore = create((set) => ({
//     searchTerm: {
//         keyword: "",
//         province: "",
//         companyName: "",
//     },
//     filters: {
//         categories: [],
//         workTypes: [],
//         levels: [],
//         skills: [],
//     },
//     setSearchTerm: (searchTerm) => set({ searchTerm }),
//     setFilters: (filters) => set({ filters }),
//     resetFilters: () =>
//         set({
//             filters: {
//                 categories: [],
//                 workTypes: [],
//                 levels: [],
//                 skills: [],
//             },
//         }),
//     resetSearchTerm: () =>
//         set({
//             searchTerm: {
//                 keyword: "",
//                 province: "",
//                 companyName: "",
//             },
//         }),
//     resetAll: () =>
//         set({
//             searchTerm: {
//                 keyword: "",
//                 province: "",
//                 companyName: "",
//             },
//             filters: {
//                 categories: [],
//                 workTypes: [],
//                 levels: [],
//                 skills: [],
//             },
//         }),
// }));
