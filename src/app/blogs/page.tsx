// app/blogs/page.tsx  — server component shell (metadata + thin wrapper)
import type { Metadata } from "next";
import BlogsClient from "./BlogsClient";

export const metadata: Metadata = {
  title: "Blog — AI Engineering, RAG Systems & MLOps",
  description:
    "Technical writing by Ayush Gurung on building production RAG systems, LLM orchestration with LangChain, pgvector semantic search, Cloudflare edge caching, and applied MLOps.",
  alternates: {
    canonical: "https://ayushgurung.com/blogs",
  },
  openGraph: {
    title: "Blog — AI Engineering, RAG Systems & MLOps | Ayush Gurung",
    description:
      "In-depth technical posts on RAG pipelines, vector databases, LangChain, FastAPI, and production AI deployment — by Ayush Gurung.",
    url: "https://ayushgurung.com/blogs",
  },
};

export default function BlogsPage() {
  return <BlogsClient />;
}
