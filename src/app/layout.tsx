import type { Metadata } from "next";
import { Merriweather, Lora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Better Kaduna",
  description:
    "Stay informed with the latest stories and updates from Kaduna State and across the Nation",
  icons: {
    icon: "https://res.cloudinary.com/dos3s9rhz/image/upload/v1771756533/logo_pvnwq1_jbf4hv.png",
  },
  openGraph: {
    title: "Better Kaduna",
    description:
      "Stay informed with the latest stories and updates from Kaduna State and across the Nation",
    images: [
      {
        url: "https://res.cloudinary.com/dos3s9rhz/image/upload/v1771756533/logo_pvnwq1_jbf4hv.png",
        width: 800,
        height: 600,
        alt: "Better Kaduna Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Better Kaduna",
    description:
      "Stay informed with the latest stories and updates from Kaduna State and across the Nation",
    images: [
      {
        url: "https://res.cloudinary.com/dos3s9rhz/image/upload/v1771756533/logo_pvnwq1_jbf4hv.png",
        width: 800,
        height: 600,
        alt: "Better Kaduna Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${merriweather.variable} ${lora.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
