export const metadata = {
  title: "Admin Dashboard",
  description: "Dashboard for administrators",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-layout">{children}</div>;
}
