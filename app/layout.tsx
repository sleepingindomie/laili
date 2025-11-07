import type { Metadata } from "next";
import { Montserrat, Lato } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Toma - Platform Agregator Bahan Baku Organik B2B",
  description: "Bahan Baku Organik Terbaik, Kunci Kepercayaan Pelanggan Anda. Platform B2B yang menghubungkan petani organik bersertifikat dengan sektor komersial melalui rantai pasok transparan.",
  icons: {
    icon: [
      { url: "/LogoToma.png" },
      { url: "/LogoToma.png", sizes: "16x16", type: "image/png" },
      { url: "/LogoToma.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/LogoToma.png",
    apple: "/LogoToma.png",
    other: {
      rel: "icon",
      url: "/LogoToma.png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${montserrat.variable} ${lato.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
