import type { AppDispatch } from "@/app/store/store";
import { fetchAdminProfile } from "@/app/redux/adminProfileSlice";
import { fetchDashboard } from "@/app/redux/dashboardAdminSlice";
import { fetchAdminRegistrations } from "@/app/redux/registrationAdminSlice";
import type { AdminRegistrationKind } from "@/lib/adminRegistrations";

const registrationPages: Record<string, AdminRegistrationKind> = {
  "/admin/pick": "recommended",
  "/admin/campaign": "campaign",
  "/admin/intergrate": "integrate",
  "/admin/sheltersetting": "shelter"
};

export const loadAdminPageData = (dispatch: AppDispatch, pathname: string) => {
  const profileRequest = dispatch(fetchAdminProfile());
  const kind = registrationPages[pathname];
  const pageRequest = kind
    ? dispatch(fetchAdminRegistrations(kind))
    : pathname === "/admin"
      ? dispatch(fetchDashboard())
      : null;

  return {
    completed: Promise.allSettled([profileRequest, pageRequest]),
    cancel: () => {
      profileRequest.abort();
      pageRequest?.abort();
    }
  };
};
