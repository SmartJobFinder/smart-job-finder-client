const apiFetch = async (url, init = {}) => {
  try {
    const res = await fetch(url, {
      credentials: "include",
      headers: { Accept: "application/json", ...(init.headers || {}) },
      ...init,
    });
    return res;
  } catch {
    return null;
  }
};

export const fetchMe = async () => {
  const res = await apiFetch("/api/v1/auth/me", { method: "GET" });
  if (!res || !res.ok) return null;
  try { return await res.json(); } catch { return null; }
};

export const isLoggedIn = async () => Boolean(await fetchMe());
export { apiFetch };