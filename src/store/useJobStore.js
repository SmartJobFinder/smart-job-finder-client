import { create } from "zustand";

export const useJobStore = create((set) => ({
  jobs: [],
  setJobs: (jobs) => set({ jobs }),
  selectedJob: null,
  setSelectedJob: (job) => set({ selectedJob: job }),
}));
