const API_BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

// Derive backend origin from the API URL (strip /api suffix) for static assets
const BACKEND_ORIGIN = API_BASE.replace(/\/api\/?$/, "") || (import.meta.env.DEV ? "http://localhost:3000" : "");

function resolveErrorMessage(payload, fallbackMessage) {
  if (typeof payload?.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  if (typeof payload?.error === "string" && payload.error.trim()) {
    return payload.error;
  }

  return fallbackMessage;
}

export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BACKEND_ORIGIN}${path}`;
}

function pickFirstString(...values) {
  for (const value of values) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) return trimmed;
    }
  }
  return "";
}

function toNonEmptyArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function normalizeTour(tour) {
  if (!tour || typeof tour !== "object") return tour;

  const normalizedId = tour.id || tour._id || tour.tourId || null;
  const normalizedName = pickFirstString(tour.name, tour.title);
  const normalizedTitle = pickFirstString(tour.title, normalizedName);

  const existingImages = toNonEmptyArray(tour.images);
  const normalizedImageUrl =
    tour.imageUrl || tour.image || existingImages[0] || null;
  const normalizedImages =
    existingImages.length > 0
      ? existingImages
      : normalizedImageUrl
        ? [normalizedImageUrl]
        : [];

  const normalizedLocation =
    pickFirstString(
      tour.location,
      [tour.departureLocation, tour.arrivalLocation].filter(Boolean).join(" -> "),
    );

  return {
    ...tour,
    id: normalizedId,
    _id: tour._id || normalizedId,
    name: normalizedName,
    title: normalizedTitle,
    imageUrl: normalizedImageUrl,
    images: normalizedImages,
    location: normalizedLocation,
  };
}

function normalizePurchase(purchase) {
  if (!purchase || typeof purchase !== "object") return purchase;

  return {
    ...purchase,
    tour: normalizeTour(purchase.tour),
  };
}

function mapApiPayload(response, mapper) {
  if (Array.isArray(response)) {
    return response.map(mapper);
  }

  if (!response || typeof response !== "object") {
    return response;
  }

  if (Array.isArray(response.data)) {
    return {
      ...response,
      data: response.data.map(mapper),
    };
  }

  if (response.data && typeof response.data === "object") {
    return {
      ...response,
      data: mapper(response.data),
    };
  }

  return mapper(response);
}

function normalizeTourResponse(response) {
  return mapApiPayload(response, normalizeTour);
}

function normalizePurchasesResponse(response) {
  return mapApiPayload(response, normalizePurchase);
}

function withTourNormalization(promise) {
  return promise.then(normalizeTourResponse);
}

function withPurchasesNormalization(promise) {
  return promise.then(normalizePurchasesResponse);
}

async function uploadImage(endpoint, file, fieldName = "image") {
  // Centralized multipart upload helper used by profile/banner/gallery operations.
  const formData = new FormData();
  formData.append(fieldName, file);

  const token = localStorage.getItem("tb_token");
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(resolveErrorMessage(data, "Resim yüklenemedi"));
  return data;
}

// Helper function
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem("tb_token");
  const isAuthEndpoint = /\/(users|companies|guides)\/auth\/(login|register)$/.test(endpoint);

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    if (res.status === 401) {
      // Force fresh auth flow when the token is expired/invalid.
      localStorage.removeItem("tb_token");
      localStorage.removeItem("tb_user");
      if (!isAuthEndpoint && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      const body = await res.json().catch(() => ({}));
      const unauthorizedError = new Error(
        resolveErrorMessage(body, "Oturum süresi doldu. Lütfen tekrar giriş yapın."),
      );
      unauthorizedError.status = 401;
      unauthorizedError.data = body;
      throw unauthorizedError;
    }
    const body = await res.json().catch(() => ({}));
    const error = new Error(resolveErrorMessage(body, `Request failed (${res.status})`));
    error.status = res.status;
    error.data = body;
    throw error;
  }

  if (res.status === 204) return null;

  return res.json();
}

// AUTHENTICATION
export const userAuth = {
  login: (email, password) =>
    request("/users/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (data) =>
    request("/users/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const companyAuth = {
  login: (email, password) =>
    request("/companies/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (data) =>
    request("/companies/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const guideAuth = {
  login: (email, password) =>
    request("/guides/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (data) =>
    request("/guides/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// USERS
export const userApi = {
  getProfile: (userId) => request(`/users/${userId}`),

  getPurchases: (userId, status) =>
    withPurchasesNormalization(
      request(
        `/users/${userId}/purchases${status ? `?status=${encodeURIComponent(status)}` : ""
        }`,
      ),
    ),

  updateProfile: (userId, data) =>
    request(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  updatePassword: (userId, data) =>
    request(`/users/${userId}/password`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteAccount: (userId) =>
    request(`/users/${userId}`, { method: "DELETE" }),
};

// COMPANIES
export const companyApi = {
  getProfile: (companyId) => request(`/companies/${companyId}`),

  updateProfile: (companyId, data) =>
    request(`/companies/${companyId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  uploadProfileImage: (companyId, file) =>
    uploadImage(`/companies/${companyId}/profile-image`, file),

  uploadBannerImage: (companyId, file) =>
    uploadImage(`/companies/${companyId}/banner-image`, file),

  deleteAccount: (companyId) =>
    request(`/companies/${companyId}`, { method: "DELETE" }),
};

export const companyTourApi = {
  listTours: (companyId) =>
    withTourNormalization(request(`/companies/${companyId}/tours`)),

  listGuides: (companyId) => request(`/companies/${companyId}/guides`),

  getTourDetail: (companyId, tourId) =>
    withTourNormalization(request(`/companies/${companyId}/tours/${tourId}`)),

  updateTour: (companyId, tourId, data) =>
    request(`/companies/${companyId}/tours/${tourId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteTour: (companyId, tourId) =>
    request(`/companies/${companyId}/tours/${tourId}`, {
      method: "DELETE",
    }),

  createTour: (companyId, formData) => {
    // Tour creation uses multipart because image upload and scalar fields are sent together.
    const url = `${API_BASE}/companies/${companyId}/tours`;
    const token = localStorage.getItem("tb_token");
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    return fetch(url, {
      method: "POST",
      headers,
      body: formData, // FormData – browser sets Content-Type with boundary
    }).then(async (res) => {
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const error = new Error(body.message || `Request failed (${res.status})`);
        error.status = res.status;
        error.data = body;
        throw error;
      }
      return body;
    });
  },
};

// TOURS
export const tourApi = {
  getTours: (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.title) params.append("title", filters.title);
    if (filters.location) params.append("location", filters.location);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (filters.date) params.append("date", filters.date);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const query = params.toString();
    return withTourNormalization(request(`/tours${query ? `?${query}` : ""}`));
  },

  getTourDetail: (tourId) =>
    withTourNormalization(request(`/tours/${tourId}`)),

  getStats: () => request("/tours/stats"),
};

// PURCHASES
export const purchaseApi = {
  purchaseTour: (tourId) =>
    request(`/users/tours/${tourId}/purchases`, {
      method: "POST",
    }),

  cancelPurchase: (purchaseId) =>
    request(`/users/purchases/${purchaseId}`, {
      method: "DELETE",
    }),
};

// REVIEWS
export const reviewApi = {
  createReview: (tourId, data) =>
    request(`/tours/${tourId}/reviews`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateReview: (reviewId, data) =>
    request(`/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteReview: (reviewId) =>
    request(`/reviews/${reviewId}`, {
      method: "DELETE",
    }),
};

// GUIDES
export const guideApi = {
  getAllGuides: () => request("/guides"),

  getDetail: (guideId) => request(`/guides/${guideId}`),

  updateProfile: (guideId, data) =>
    request(`/guides/${guideId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteAccount: (guideId) =>
    request(`/guides/${guideId}`, { method: "DELETE" }),

  uploadProfileImage: (guideId, file) =>
    uploadImage(`/guides/${guideId}/profile-image`, file),

  uploadBannerImage: (guideId, file) =>
    uploadImage(`/guides/${guideId}/banner-image`, file),

  uploadGalleryImage: (guideId, file) =>
    uploadImage(`/guides/${guideId}/gallery-images`, file),

  removeGalleryImage: (guideId, imageUrl) =>
    request(`/guides/${guideId}/gallery-images`, {
      method: "DELETE",
      body: JSON.stringify({ imageUrl }),
    }),

  listCompanies: () => request("/guides/companies"),

  listMyCompanies: (guideId) => request(`/guides/${guideId}/companies`),

  applyToCompany: (guideId, companyId) =>
    request(`/guides/${guideId}/companies`, {
      method: "POST",
      body: JSON.stringify({ companyId }),
    }),

  removeFromCompany: (guideId, companyId) =>
    request(`/guides/${guideId}/companies/${companyId}`, { method: "DELETE" }),

  listTours: (guideId) =>
    withTourNormalization(request(`/guides/${guideId}/tours`)),

  assignTour: (guideId, tourId) =>
    request(`/guides/${guideId}/tours`, {
      method: "POST",
      body: JSON.stringify({ tourId }),
    }),

  removeTour: (guideId, tourId) =>
    request(`/guides/${guideId}/tours/${tourId}`, {
      method: "DELETE",
    }),
};

// FAVORITES
export const favoriteApi = {
  getFavorites: (userId) =>
    withTourNormalization(request(`/users/${userId}/favorites`)),

  addFavorite: (userId, tourId) =>
    request(`/users/${userId}/favorites`, {
      method: "POST",
      body: JSON.stringify({ tourId }),
    }),

  removeFavorite: (userId, tourId) =>
    request(`/users/${userId}/favorites/${tourId}`, {
      method: "DELETE",
    }),
};
