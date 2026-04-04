const API_BASE = import.meta.env.VITE_API_URL;

// Helper function to make API requests with proper headers and error handling
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem("tb_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const error = new Error(
      body.message || body.error || `Request failed (${res.status})`,
    );
    error.status = res.status;
    error.data = body;
    throw error;
  }

  if (res.status === 204) return null;

  return res.json();
}

// Authentication related API calls for users
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

// Authentication related API calls for companies
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

// Authentication related API calls for guides
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

// User profile API calls
export const userApi = {
  getProfile: (userId) => request(`/users/${userId}`),

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

// Company profile API calls
export const companyApi = {
  getProfile: (companyId) => request(`/companies/${companyId}`),

  updateProfile: (companyId, data) =>
    request(`/companies/${companyId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteAccount: (companyId) =>
    request(`/companies/${companyId}`, { method: "DELETE" }),
};

// Company tour API calls
export const companyTourApi = {
  listTours: (companyId) => request(`/companies/${companyId}/tours`),
};

// Public tour API calls
export const tourApi = {
  getTours: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.location) params.append("location", filters.location);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (filters.date) params.append("date", filters.date);
    const query = params.toString();
    return request(`/tours${query ? `?${query}` : ""}`);
  },
};

// Guide related API calls for dashboard operations
export const guideApi = {
  getDetail: (guideId) => request(`/guides/${guideId}`),

  updateProfile: (guideId, data) =>
    request(`/guides/${guideId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteAccount: (guideId) =>
    request(`/guides/${guideId}`, { method: "DELETE" }),

  uploadProfileImage: async (guideId, file) => {
    const formData = new FormData();
    formData.append("image", file);
    const token = localStorage.getItem("tb_token");
    const res = await fetch(`${BASE_URL}/guides/${guideId}/profile-image`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Resim yüklenemedi");
    return data;
  },

  listCompanies: () => request("/companies"),

  listMyCompanies: (guideId) => request(`/guides/${guideId}/companies`),

  applyToCompany: (guideId, companyId) =>
    request(`/guides/${guideId}/companies`, {
      method: "POST",
      body: JSON.stringify({ companyId }),
    }),

  removeFromCompany: (guideId, companyId) =>
    request(`/guides/${guideId}/companies/${companyId}`, { method: "DELETE" }),

  listTours: (guideId) => request(`/guides/${guideId}/tours`),

  assignTour: (guideId, tourId) =>
    request(`/guides/${guideId}/tours`, {
      method: "POST",
      body: JSON.stringify({ tourId }),
    }),

  removeTour: (guideId, tourId) =>
    request(`/guides/${guideId}/tours/${tourId}`, { method: "DELETE" }),
};
