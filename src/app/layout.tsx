import { Inter } from 'next/font/google';
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: "Ayush Gurung - Software Engineer",
  description: "I'm a Software engineer specializing in full-stack web development, AI, and building modern, scalable applications. View my portfolio and projects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/icon.ico" />
      </head>
      <body
        className={`${inter.variable} antialiased bg-black text-gray-100`}
      >
        <Header />
        <main className="p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
