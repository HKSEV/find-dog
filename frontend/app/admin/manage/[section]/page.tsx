import { notFound } from "next/navigation";
import AdminOperationPage from "@/app/components/admin/AdminOperationPage";
import { adminOperationPages } from "@/lib/adminOperations";

export const dynamicParams = false;

export function generateStaticParams() {
  return adminOperationPages.map(({slug}) => ({section: slug}));
};

export default async function OperationPage({params}: {params: Promise<{section: string}>}) {
  const {section} = await params;
  const operation = adminOperationPages.find(({slug}) => slug === section);
  if (!operation) notFound();
  return <AdminOperationPage key={section} operation={operation}/>;
};
