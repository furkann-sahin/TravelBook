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

  listCompanies: () => request("/companies"),

  listTours: (guideId) => request(`/guides/${guideId}/tours`),

  assignTour: (guideId, tourId) =>
    request(`/guides/${guideId}/tours`, {
      method: "POST",
      body: JSON.stringify({ tourId }),
    }),

  removeTour: (guideId, tourId) =>
    request(`/guides/${guideId}/tours/${tourId}`, { method: "DELETE" }),
};
