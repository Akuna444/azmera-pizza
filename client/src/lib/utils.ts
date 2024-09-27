export function getFromLocalStorage(key: string) {
  if (!key || typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem(key);
}

export const backendURL = "http://localhost:5000/api";
