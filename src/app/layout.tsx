import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL("https://ayushgurung.com"),
  title: {
    default: "Ayush Gurung — AI Engineer | RAG Systems, LLM Orchestration & MLOps",
    template: "%s | Ayush Gurung — AI Engineer",
  },
  description:
    "Ayush Gurung is an AI Engineer who designs and ships production-grade RAG systems, multi-layer semantic caching pipelines, and Cloudflare edge-deployed LLM gateways. Tech: FastAPI, LangChain, pgvector, Sentence-Transformers, Groq, Supabase, Next.js 19.",
  keywords: [
    "Ayush Gurung",
    "AI Engineer",
    "RAG System",
    "LLM Engineer",
    "MLOps",
    "LangChain",
    "pgvector",
    "Semantic Cache",
    "FastAPI",
    "Cloudflare Worker AI",
    "Next.js AI",
    "Vector Database",
    "Groq LLM",
    "Sentence Transformers",
    "AI Software Engineer",
    "Full Stack AI",
    "Supabase",
    "Retrieval Augmented Generation",
  ],
  openGraph: {
    type: "website",
    url: "https://ayushgurung.com",
    title: "Ayush Gurung — AI Engineer | RAG Systems, LLM Orchestration & MLOps",
    description:
      "AI Engineer who designs production-grade RAG systems with multi-layer semantic caching, Cloudflare edge-deployed LLM gateways, and full-stack AI applications.",
    siteName: "Ayush Gurung",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayush Gurung — AI Engineer | RAG Systems, LLM Orchestration & MLOps",
    description:
      "Designing production-grade RAG systems, edge-deployed LLM gateways, and semantic caching pipelines. FastAPI · pgvector · LangChain · Cloudflare Workers · Next.js 19.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://ayushgurung.com",
  },
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
      <body className={`${inter.variable} antialiased bg-black text-gray-100`}>
        <Header />
        <main className="p-4">{children}</main>
        <Footer />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}
