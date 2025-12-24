import { useState, useEffect } from "react";
import api from "@/lib/api";

export function useAllJobs() {
  const [allJobs, setAllJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const jobs = [];
        let page = 0;
        let hasMore = true;
        const size = 100; // Fetch 100 items mỗi lần

        while (hasMore) {
          const response = await api.get(
            `/job/all?page=${page}&size=${size}&sort=id,asc`
          );
          const data = response.data;

          if (Array.isArray(data.content)) {
            jobs.push(...data.content);
            hasMore = !data.last && data.content.length > 0;
            page++;
          } else {
            hasMore = false;
          }
        }

        setAllJobs(jobs);
      } catch (err) {
        setError(err);
        console.error("Error fetching all jobs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  return { jobs: allJobs, isLoading, error };
}
