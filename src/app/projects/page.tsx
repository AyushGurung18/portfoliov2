// app/projects/page.tsx  — server component shell (metadata + thin wrapper)
import type { Metadata } from "next";
import ProjectsClient from "./ProjectsClient";

export const metadata: Metadata = {
  title: "Projects — Production AI Systems & Full-Stack Engineering",
  description:
    "A curated portfolio of production engineering work by Ayush Gurung — including full-stack RAG systems with pgvector, Cloudflare edge-cached LLM gateways, FastAPI backends, and Next.js 19 frontends.",
  alternates: {
    canonical: "https://ayushgurung.com/projects",
  },
  openGraph: {
    title: "Projects — Production AI Systems | Ayush Gurung",
    description:
      "Production-grade AI engineering projects: RAG pipelines, semantic caching layers, edge AI gateways, and full-stack applications built by Ayush Gurung.",
    url: "https://ayushgurung.com/projects",
  },
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
