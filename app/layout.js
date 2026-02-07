import { Montserrat, Anek_Bangla } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});
const base = Anek_Bangla({
  variable: "--font-base",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dr Sah Alam",
  description: "Specialist in orthopedics ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${montserrat.variable} ${base.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
