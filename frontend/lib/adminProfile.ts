export interface AdminProfile {
  name: string;
  nickname: string;
  email: string;
  phone: string | null;
  profileImageUrl: string | null;
  adminLevel: string | null;
  department: string | null;
}

export const getAdminProfileImage = (value?: string | null) => {
  if (!value) return "";
  if (value.startsWith("/uploads/")) return value;

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    if (["localhost", "127.0.0.1"].includes(url.hostname) && url.pathname.startsWith("/uploads/")) {
      return url.pathname + url.search;
    };
    return url.href;
  } catch {
    return "";
  }
};
