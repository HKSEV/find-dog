import type { AppDispatch } from "@/app/store/store";
import { fetchAdminProfile } from "@/app/redux/adminProfileSlice";
import { fetchDashboard } from "@/app/redux/dashboardAdminSlice";
import { fetchAdminRegistrations } from "@/app/redux/registrationAdminSlice";
import type { AdminRegistrationKind } from "@/lib/adminRegistrations";
import { getAdminRemainingSeconds, getAdminSession, getAdminSessionId } from "@/lib/adminAuth";
import { isAdminSessionRenewing } from "@/lib/adminApi";

const registrationPages: Record<string, AdminRegistrationKind> = {
  "/admin/pick": "recommended",
  "/admin/campaign": "campaign",
  "/admin/intergrate": "integrate",
  "/admin/sheltersetting": "shelter"
};

export const loadAdminPageData = (dispatch: AppDispatch, pathname: string) => {
  const session = getAdminSession();
  if (!session || (getAdminRemainingSeconds(session) === 0 && !isAdminSessionRenewing(session.token))) {
    return {completed: Promise.resolve(false), cancel: () => undefined};
  };
  const profileRequest = dispatch(fetchAdminProfile());
  const kind = registrationPages[pathname];
  const pageRequest = kind
    ? dispatch(fetchAdminRegistrations(kind))
    : pathname === "/admin"
      ? dispatch(fetchDashboard())
      : null;
  let isCanceled = false;
  const completed = Promise.all([profileRequest, pageRequest]).then(([result]) => {
    const current = getAdminSession();
    return !isCanceled && fetchAdminProfile.fulfilled.match(result) && current !== null
      && getAdminSessionId(current) === getAdminSessionId(session)
      && (getAdminRemainingSeconds(current) > 0 || isAdminSessionRenewing(current.token));
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
