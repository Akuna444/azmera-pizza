export function getFromLocalStorage(key: string) {
  if (!key || typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem(key);
}

export const backendURL = process.env.API_BASE_URL;
