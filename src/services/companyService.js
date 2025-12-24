import api from "@/lib/api";

// Service để lấy company của user hiện tại
export const getMyCompany = async () => {
  try {
    const response = await api.get("/companies/my-company");
    return response.data;
  } catch (error) {
    console.error("Error fetching my company:", error);
    throw error;
  }
};

// Service để tạo company mới với ảnh
export const createCompany = async (
  companyData,
  avatarFile = null,
  coverFile = null
) => {
  try {
    const formData = new FormData();

    // Thêm tất cả dữ liệu text vào FormData
    Object.keys(companyData).forEach(key => {
      const value = companyData[key];
      if (value === null || value === undefined || value === "") return;

      if (key === "categoryIds" && Array.isArray(value)) {
        // Gửi từng categoryId riêng lẻ
        value.forEach(id => {
          formData.append("categoryIds", id);
        });
      } else if (key === "wardIds" && Array.isArray(value)) {
        // Gửi từng wardId riêng lẻ
        value.forEach(id => {
          formData.append("wardIds", id);
        });
      } else {
        formData.append(key, value);
      }
    });

    // Thêm files nếu có
    if (avatarFile) {
      formData.append("avatarFile", avatarFile);
    }
    if (coverFile) {
      formData.append("avatarCoverFile", coverFile);
    }

    // Tạo axios instance riêng với timeout dài hơn cho upload
    const uploadApi = api.create({
      timeout: 120000, // 2 phút cho upload
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const response = await uploadApi.post("/companies/add", formData);
    return response.data;
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
};

// Service để cập nhật company
export const updateCompany = async (companyId, companyData) => {
  try {
    const response = await api.put(`/companies/${companyId}`, companyData);
    return response.data;
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};
