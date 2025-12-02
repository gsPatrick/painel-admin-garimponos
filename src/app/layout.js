import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'react-international-phone/style.css'; // <<< Adicione esta linha

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Painel Ecommerce",
  description: "Painel Ecommerce",
};

import Providers from "@/components/providers";
import { AccessDeniedModal } from "@/components/auth/AccessDeniedModal";

// ...

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
          <AccessDeniedModal />
        </Providers>
      </body>
    </html>
  );
}