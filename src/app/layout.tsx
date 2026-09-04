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
  title: {
    default: "AAA DME",
    template: "AAA DME - %s",
  },
  description:
    "AAA DME Healthcare — doctor-prescribed durable medical equipment, insurance handled for you, delivered nationwide.",
  icons: { icon: "/assets/images/images/icon.png" },
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
