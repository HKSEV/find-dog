import { AdminModalProvider } from "@/app/components/contexts/AdminModalContext";

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return <AdminModalProvider>{children}</AdminModalProvider>;
};
