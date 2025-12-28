import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-cabinet",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Jenn Umanzor",
  description: "Marathon runner, consultant, and builder based in Washington, DC.",
  openGraph: {
    title: "Jenn Umanzor",
    description: "Marathon runner, consultant, and builder based in Washington, DC.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSerif.variable} ${dmSans.variable}`}>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
