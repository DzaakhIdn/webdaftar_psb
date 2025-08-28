export const metadata = {
  title: "Registrant Dashboard",
  description: "Dashboard for registrants",
};

export default function RegistrantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="registrant-layout">{children}</div>;
}
