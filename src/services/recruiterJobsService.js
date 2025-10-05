import api from '@/lib/api';

export async function searchJobsByCompany({ companyId, filters = {}, page = 0, size = 5, sort = 'id,desc' }) {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', String(page));
    if (size !== undefined) params.append('size', String(size));
    if (sort) params.append('sort', sort);

    // Dùng đường dẫn tương đối vì axios đã cấu hình baseURL (/api/v1)
    const queryString = params.toString();
    const url = `/job/company/${companyId}/search${queryString ? `?${queryString}` : ''}`;
    const { data } = await api.post(url, filters);
    return data;
}

export async function patchJobById(jobId, payload) {
    const { data } = await api.patch(`/job/${jobId}`, payload);
    return data;
}

export function buildDefaultFiltersFor(tab) {
    switch (tab) {
        case 'active':
            return { status: 'ACTIVE', onlyActive: true };
        case 'drafts':
            return { status: 'DRAFT' };
        case 'expired':
            return { status: 'INACTIVE', onlyActive: false };
        default:
            return {};
    }
} 