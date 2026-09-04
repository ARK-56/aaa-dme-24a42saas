import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

/** Chrome shared by every public page — the admin panel sits outside it. */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
