export const mapJobToView = (job) => {
  const company = job?.company ?? {};
  const companyIdRaw =
    company.company_id ??
    company.id ??
    company.companyId ??
    job?.companyId ??
    job?.company_id ??
    null;

  const isPro =
    (company.isProCompany !== undefined && company.isProCompany !== null
      ? company.isProCompany
      : undefined) ??
    company.proCompany ??
    job?.isProCompany ??
    false;

  return {
    id: job?.id,
    title: job?.title ?? "",
    description: job?.description ?? "",
    requirements: job?.requirements ?? "",
    benefits: job?.benefits ?? "",
    location: job?.location ?? "",

    companyId: companyIdRaw != null ? String(companyIdRaw) : null,
    companyName: company?.company_name ?? job?.companyName ?? "",
    avatar: company?.avatar ?? job?.avatar ?? "",
    isProCompany: Boolean(isPro),

    category: job?.category_names ?? job?.category ?? [],
    level: job?.level_names ?? job?.level ?? [],
    workType: job?.work_type_names ?? job?.workType ?? [],
    skill: job?.skill_names ?? job?.skill ?? [],
    city: job?.wards ?? job?.city ?? [],

    salaryDisplay: job?.salaryDisplay ?? job?.salary_display ?? "Negotiable",
    datePost: job?.date_post ?? job?.datePost ?? null,
    expiredDate: job?.expired_date ?? job?.expiredDate ?? null,
  };
};