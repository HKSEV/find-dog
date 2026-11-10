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
  let isCanceled = false;
  let pageRequest: ReturnType<ReturnType<typeof fetchAdminRegistrations>> | ReturnType<ReturnType<typeof fetchDashboard>> | null = null;
  const completed = profileRequest.then(async (result) => {
    if (isCanceled || !fetchAdminProfile.fulfilled.match(result)) return false;
    const kind = registrationPages[pathname];
    pageRequest = kind
      ? dispatch(fetchAdminRegistrations(kind))
      : pathname === "/admin"
        ? dispatch(fetchDashboard())
        : null;
    if (pageRequest) await pageRequest;
    return !isCanceled;
  });

  return {
    completed,
    cancel: () => {
      isCanceled = true;
      profileRequest.abort();
      pageRequest?.abort();
    }
  };
};
