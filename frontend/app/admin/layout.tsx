import { AdminModalProvider } from "@/app/components/contexts/AdminModalContext";
import AdminSessionManager from "@/app/components/admin/AdminSessionManager";
import AdminShell from "@/app/components/admin/AdminShell";

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return (
    <AdminModalProvider>
      <AdminSessionManager/>
      <AdminShell>{children}</AdminShell>
    </AdminModalProvider>
  );
};
