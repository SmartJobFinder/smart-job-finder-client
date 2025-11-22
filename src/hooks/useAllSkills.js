import { useState, useEffect } from "react";
import api from "@/lib/api";

export function useAllSkills() {
    const [allSkills, setAllSkills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const skills = [];
                let page = 0;
                let hasMore = true;
                const size = 100; // Fetch 100 items mỗi lần

                while (hasMore) {
                    const response = await api.get(
                        `/skill?page=${page}&size=${size}&sort=id,asc`
                    );
                    const data = response.data;

                    if (Array.isArray(data.content)) {
                        skills.push(...data.content);
                        hasMore = !data.last && data.content.length > 0;
                        page++;
                    } else {
                        hasMore = false;
                    }
                }

                setAllSkills(skills);
            } catch (err) {
                setError(err);
                console.error("Error fetching all skills:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAll();
    }, []);

    return { skills: allSkills, isLoading, error };
}
