import api from "@/lib/api";
import { USER_API, COMPANY_API } from "@/constants/apiCompanyConstants";

// Service để kiểm tra user có công ty hay không
export const checkUserHasCompany = async () => {
  try {
    const response = await api.get(USER_API.CHECK_HAS_COMPANY);
    return response.data;
  } catch (error) {
    console.error("Error checking user company:", error);
    throw error;
  }
};

// Service để lấy chi tiết công ty
export const getCompanyDetail = async companyId => {
  try {
    const response = await api.get(COMPANY_API.GET_COMPANY_DETAIL(companyId));
    return response.data;
  } catch (error) {
    console.error("Error fetching company detail:", error);
    throw error;
  }
};

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

// Service để cập nhật company
export const updateCompany = async (
  companyId,
  companyData,
  avatarFile = null,
  coverFile = null
) => {
  try {
    if (!companyId || companyId === "null" || companyId === "undefined") {
      throw new Error("Invalid company ID");
    }

    // ===== CÓ FILE ẢNH MỚI =====
    if (avatarFile || coverFile) {
      const formData = new FormData();

      // Append tất cả các field text
      Object.keys(companyData).forEach(key => {
        if (key === "avatar" || key === "avatarCover") {
          return; // Bỏ qua URL string
        }

        if (key === "categoryIds" && Array.isArray(companyData[key])) {
          companyData[key].forEach(id => {
            formData.append("categoryIds", id);
          });
        } else if (
          companyData[key] !== null &&
          companyData[key] !== undefined
        ) {
          formData.append(key, companyData[key]);
        }
      });

      // Append file ảnh
      if (avatarFile) {
        formData.append("avatarFile", avatarFile);
      }
      if (coverFile) {
        formData.append("avatarCoverFile", coverFile);
      }

      console.log("=== UPDATE WITH IMAGES ===");
      console.log("Company ID:", companyId);

      const response = await api.patch(
        `/companies/${companyId}/with-images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000,
        }
      );

      console.log("Update with images success:", response.data);
      return response.data;
    }

    // ===== KHÔNG CÓ FILE ẢNH MỚI =====
    const cleanData = {
      companyName: String(companyData.companyName || "").trim(),
      description: String(companyData.description || "").trim(),
      email: String(companyData.email || "").trim(),
      phoneNumber: String(companyData.phoneNumber || "").trim(),
      website: String(companyData.website || "").trim(),
      address: String(companyData.address || "").trim(),
      locationCity: String(companyData.locationCity || "").trim(),
      locationCountry: String(companyData.locationCountry || "Vietnam"),
      wardIds: Array.isArray(companyData.wardIds)
        ? companyData.wardIds
            .map(id => Number(id))
            .filter(id => !isNaN(id) && id > 0)
        : undefined,
      foundedYear:
        parseInt(companyData.foundedYear, 10) || new Date().getFullYear(),
      quantityEmployee: parseInt(companyData.quantityEmployee, 10) || 1,
      status: String(companyData.status || "active"),
      proCompany: Boolean(companyData.proCompany),
      facebookUrl: String(companyData.facebookUrl || "").trim(),
      twitterUrl: String(companyData.twitterUrl || "").trim(),
      linkedinUrl: String(companyData.linkedinUrl || "").trim(),
      mapEmbedUrl: String(companyData.mapEmbedUrl || "").trim(),
      categoryIds: Array.isArray(companyData.categoryIds)
        ? companyData.categoryIds
            .map(id => Number(id))
            .filter(id => !isNaN(id) && id > 0)
        : [],
    };

    console.log("=== UPDATE WITHOUT IMAGES ===");
    console.log("Company ID:", companyId);

    const response = await api.patch(`/companies/${companyId}`, cleanData, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    console.log("Update success:", response.data);
    return response.data;
  } catch (error) {
    console.error("=== UPDATE ERROR ===", error);

    if (error.response) {
      const errorData = error.response.data;
      let errorMessage = "Failed to update company";

      if (typeof errorData === "string") {
        errorMessage = errorData;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }

      throw new Error(errorMessage);
    }

    throw error;
  }
};
