import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { GoogleAnalytics } from "@next/third-parties/google";
import Head from "next/head";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Ayush Gurung - Software Engineer",
  description:
    "I'm a Software engineer specializing in full-stack web development, AI, and building modern, scalable applications. View my portfolio and projects.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>Ayush Gurung - Software Engineer</title>
        <meta
          name="description"
          content="I'm a Software engineer specializing in full-stack web development, AI, and building modern, scalable applications. View my portfolio and projects."
        />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </Head>
      <body className={`${inter.variable} antialiased bg-black text-gray-100`}>
        <Header />
        <main className="p-4">{children}</main>
        <Footer />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}
