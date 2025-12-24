export const recruiterKpi = {
  activeJobs: 12,
  totalApplicants: 254,
  applicantsLast30Days: 47,
  totalHires: 18,
  viewsToday: 36,
};

// Generate 30 days of application trend data
export const recruiterTrend = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));

  // Create some patterns - weekends have fewer applications
  const isWeekend = [0, 6].includes(date.getDay());

  // Random count based on day of week
  let count;
  if (isWeekend) {
    count = Math.floor(Math.random() * 4); // 0-3 applications on weekends
  } else {
    count = Math.floor(Math.random() * 8) + 1; // 1-8 applications on weekdays
  }

  // Add some peaks
  if (i === 15 || i === 23) {
    count += Math.floor(Math.random() * 6) + 5;
  }

  return {
    date: date.toISOString().split("T")[0],
    count,
  };
});
