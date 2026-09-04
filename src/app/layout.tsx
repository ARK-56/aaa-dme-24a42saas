import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import AuthModal from "@/components/modals/AuthModal";
import Providers from "@/components/Providers";
import "@/styles/style.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  // Resolves canonical and Open Graph URLs to absolute ones. Override with
  // NEXT_PUBLIC_SITE_URL on preview deployments.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://aaadmeinc.com"
  ),
  title: {
    default: "AAA DME",
    template: "AAA DME - %s",
  },
  description:
    "AAA DME Healthcare — doctor-prescribed durable medical equipment, insurance handled for you, delivered nationwide.",
  icons: { icon: "/assets/images/images/icon.png" },
  openGraph: {
    siteName: "AAA DME",
    type: "website",
    // No `url` here on purpose: a value set at the root would emit the same
    // og:url on every page. Set it per route when a page needs a canonical.
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={jakarta.className}>
        <Providers>
          {children}
          <AuthModal />
        </Providers>
      </body>
    </html>
  );
}
