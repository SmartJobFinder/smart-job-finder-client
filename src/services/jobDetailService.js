import api from "@/lib/api";

export const getJobDetail = async (id) => {
    if (!id && id !== 0) throw new Error("Missing job id");

    try {
        const { data } = await api.get(
            `${process.env.NEXT_PUBLIC_API_PROXY_TARGET}${process.env.NEXT_PUBLIC_API_BASE_URL}/job/${id}`,
            {
                headers: { "Cache-Control": "no-store" },
            }
        );

        const company = data.company || {};
        const isPro =
            (company.isProCompany !== undefined && company.isProCompany !== null
                ? company.isProCompany
                : undefined) ?? company.proCompany ?? false;

        return {
            id: data.id,
            title: data.title || "",
            description: data.description,
            requirements: data.requirements,
            benefits: data.benefits,
            location: data.location,
            companyId: company?.company_id ?? null,
            companyName: company?.company_name || "",
            isProCompany: Boolean(isPro),
            avatar: company?.avatar || "",
            category: data.category_names || [],
            level: data.level_names || [],
            workType: data.work_type_names || [],
            skill: data.skill_names || [],
            city: data.wards || [],
            salaryDisplay: data.salaryDisplay || "Negotiable",
            datePost: data.date_post,
            expiredDate: data.expired_date,
        };
    } catch (err) {
        console.error("getJobDetail error:", err);
        throw err;
    }
};

