import Footer from "../layout/Footer";
import Header from "./Header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <Header />
    {children}
    <Footer />
    </>


  );
}
