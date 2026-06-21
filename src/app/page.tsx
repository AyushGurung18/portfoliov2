"use client";
import About from "@/components/About";
import Project from "@/components/Projects";
import Blogs from "@/components/Blogs";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { motion } from "framer-motion";

// ── Animation presets ──────────────────────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};
const item = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};
const fadeUp = {
  hidden: { y: 32, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

// ── Pillar card data ───────────────────────────────────────────────────────────
const pillars = [
  {
    icon: "🗃️",
    title: "RAG Systems & Vector Search",
    body: "I design end-to-end Retrieval-Augmented Generation pipelines — document ingestion with PyMuPDF, recursive overlap chunking, batch embedding via Sentence-Transformers, and ANN retrieval with pgvector. Every retrieval call is user-scoped at the DB layer, not just in application logic.",
  },
  {
    icon: "⚡",
    title: "Multi-Layer Semantic Caching",
    body: "Purpose-built three-tier caching: a Cloudflare Workers AI edge layer that intercepts queries before they reach the origin, a PostgreSQL PL/pgSQL cosine-similarity cache for semantically equivalent questions (≥ 0.85 threshold), and a POSIX-atomic flat-file cache on persistent volume to eliminate cold-start Supabase latency.",
  },
  {
    icon: "🔗",
    title: "LLM Orchestration",
    body: "LangChain chains wired to Groq (LLaMA 3.3 70B, Qwen 32B) for sub-second cloud inference and local Ollama for fully offline deployments. History-aware retrievers rephrase ambiguous follow-ups before similarity search — keeping coherence across long conversations without hallucinating context.",
  },
  {
    icon: "🌐",
    title: "Edge-First Architecture",
    body: "TypeScript Cloudflare Workers intercept every POST, generate 384-dim query embeddings with @cf/baai/bge-small-en-v1.5, and stream cached answers as ReadableStreams — identical to a live LLM response. Cache HIT responses never reach the FastAPI origin. Cloudflare KV holds session-list state with programmatic invalidation.",
  },
  {
    icon: "🔐",
    title: "Auth & Data Isolation",
    body: "Supabase HS256 JWTs verified per-request via a FastAPI HTTPBearer dependency. Both real and anonymous users receive a stable UUID sub claim — enforcing per-user data isolation uniformly at the vector-DB filter level and the session ownership check level.",
  },
  {
    icon: "🧱",
    title: "Full-Stack AI Applications",
    body: "Next.js 19 (React 19) frontends with GSAP scroll-driven animations and HTML5 Canvas AI-state indicators (Idle / Thinking / Streaming). Token-streaming via Fetch API reader.read() loops — a cache HIT and a live LLM response are transparent to the UI.",
  },
];

export default function Home() {
  return (
    <>
      <div>
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={container}
          className="px-4 text-left sm:py-44 pt-44 pb-20"
          aria-label="Introduction"
        >
          <motion.p
            variants={item}
            className="lg:text-3xl text-xl font-semibold tracking-tighter text-[#3CCF91] mb-3"
          >
            Hey there, I&apos;m—
          </motion.p>

          <motion.h1
            variants={item}
            className="text-7xl md:text-8xl lg:text-9xl font-bold mb-4 tracking-tighter leading-none"
          >
            Ayush Gurung.
          </motion.h1>

          <motion.div variants={item} className="mt-4 mb-2">
            <p className="lg:text-4xl text-2xl font-medium tracking-tighter">
              AI Engineer.{" "}
              <span className="text-[#869094]">
                I design systems that make LLMs{" "}
                <span className="text-white">reliable, fast, and cheap</span> to
                operate — not just functional.
              </span>
            </p>
          </motion.div>

          <motion.p
            variants={item}
            className="lg:text-lg text-sm text-[#4a5568] mt-5 mb-1 font-mono tracking-wide"
          >
            FastAPI · LangChain · pgvector · Sentence-Transformers · Groq ·
            Cloudflare Workers AI · Next.js 19 · Supabase · Docker
          </motion.p>

          <motion.p
            variants={item}
            className="lg:text-xl md:text-base text-sm text-[#869094] mt-3"
          >
            ⚡ AI Engineer at{" "}
            <span className="text-white font-medium">Draft n Craft</span>
          </motion.p>

          {/* ── CTA buttons ─────────────────────────────────────────────── */}
          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap sm:justify-start gap-4"
          >
            {[
              {
                href: "https://github.com/ayushgurung18",
                label: "GitHub",
                icon: <FaGithub size={18} color="#3CCF91" />,
                external: true,
              },
              {
                href: "https://linkedin.com/in/ayushgurung",
                label: "LinkedIn",
                icon: <FaLinkedin size={18} color="#3CCF91" />,
                external: true,
              },
              {
                href: "mailto:ayushgurung18sep@gmail.com",
                label: "Email",
                icon: <MdEmail size={18} color="#3CCF91" />,
                external: false,
              },
            ].map(({ href, label, icon, external }) => (
              <motion.a
                key={label}
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                whileHover={{ scale: 1.04 }}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#141414] border border-[#242424] rounded-md hover:bg-[#1e1e1e] hover:border-[#3CCF91]/40 cursor-pointer transition-all"
              >
                {icon}
                {label}
              </motion.a>
            ))}
          </motion.div>
        </motion.section>

        {/* ── WHAT I ACTUALLY BUILD ─────────────────────────────────────────── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
          className="px-4 pb-24"
          aria-label="Core engineering capabilities"
        >
          <motion.div variants={fadeUp} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-3">
              What I Actually Build
            </h2>
            <p className="text-[#869094] text-sm sm:text-base max-w-2xl leading-relaxed">
              The following isn&apos;t a list of technologies I&apos;ve touched.
              It&apos;s a description of the production systems I&apos;ve
              designed, the tradeoffs I weighed, and the engineering decisions
              behind each one.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillars.map((p, i) => (
              <motion.article
                key={p.title}
                variants={fadeUp}
                custom={i}
                className="group border border-[#1e1e1e] rounded-lg p-6 bg-[#0a0a0a] hover:border-[#3CCF91]/30 hover:bg-[#0f0f0f] transition-all duration-300"
              >
                <div className="text-2xl mb-3">{p.icon}</div>
                <h3 className="text-white font-semibold tracking-tight mb-2 text-base sm:text-lg">
                  {p.title}
                </h3>
                <p className="text-[#869094] text-sm leading-relaxed">{p.body}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* ── ENGINEERING PHILOSOPHY ────────────────────────────────────────── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
          className="px-4 pb-24"
          aria-label="Engineering philosophy"
        >
          <motion.div
            variants={fadeUp}
            className="border border-[#1e1e1e] rounded-lg p-8 md:p-12 bg-[#0a0a0a] max-w-4xl"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-white mb-6">
              The Question I Always Ask First
            </h2>
            <div className="space-y-4 text-[#869094] text-sm sm:text-base leading-relaxed">
              <p>
                Most engineers building with LLMs ask: &quot;which model gives
                the best answer?&quot; That&apos;s a valid question — but
                it&apos;s rarely the expensive one in production. The expensive
                questions are: how many API calls am I making that I
                didn&apos;t need to? How much latency is my architecture
                adding before a user sees a single token? What happens when
                the inference provider goes down?
              </p>
              <p>
                That thinking is what led me to build a{" "}
                <span className="text-white font-medium">
                  three-tier caching system
                </span>{" "}
                where a semantically equivalent question — even rephrased —
                never hits an LLM twice. The edge layer intercepts the
                request, generates an embedding locally using Cloudflare
                Workers AI, performs a cosine-similarity lookup against a
                PostgreSQL semantic cache (pgvector,{" "}
                <code className="text-[#3CCF91] bg-[#111] px-1 rounded text-xs">
                  &lt;=&gt;
                </code>{" "}
                operator, 0.85 threshold), and streams the cached answer back
                to the client — formatted identically to a live LLM stream so
                the frontend never has to know the difference.
              </p>
              <p>
                That&apos;s not premature optimisation. That&apos;s the
                difference between a system that scales and one that runs up
                API bills doing redundant work.
              </p>
              <p>
                I care equally about the parts users don&apos;t see: atomic
                file writes that can&apos;t corrupt mid-crash, JWT verification
                that scopes every DB query to the right UUID, retrieval
                filters that enforce data isolation at the pgvector layer
                rather than relying on application-level guards. The
                reliability of the system underneath determines the quality of
                the AI on top.
              </p>
            </div>
          </motion.div>
        </motion.section>

        <About />
        <Project />
        <Blogs />
      </div>
    </>
  );
}