// components/About.tsx
"use client";

import Tooltip from "./Tooltip";
import Image from "next/image";

const About = () => {
  return (
    <section className="p-4 text-left" aria-label="About Ayush Gurung — AI Engineer">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-12">

        {/* ── Left column: Bio ─────────────────────────────────────────────── */}
        <div className="text-[#869094]">
          <h2
            style={{ fontFamily: "Ubuntu, sans-serif" }}
            className="text-2xl text-white font-semibold tracking-tighter mb-6"
          >
            ⚡ About Me
          </h2>

          <div className="tracking-tight text-sm sm:text-base space-y-5 leading-relaxed">
            <p>
              I&apos;m Ayush Gurung — an{" "}
              <Tooltip
                text="AI Engineer"
                tooltipText="I build the systems that make LLMs useful in production: retrieval pipelines, caching layers, and edge gateways — not just wrappers around an OpenAI call."
              />{" "}
              who cares about the engineering underneath the model. The question
              that drives most of my work isn&apos;t &quot;which LLM is
              smartest?&quot; — it&apos;s &quot;how do I make this reliable,
              fast, and cheap to operate at scale?&quot;
            </p>

            <p>
              My flagship project,{" "}
              <Tooltip
                text="bbygrl / thotqen"
                tooltipText="A full-stack AI Knowledge Copilot: React 19 frontend with GSAP canvas animations, FastAPI backend, LangChain RAG orchestration, pgvector semantic search, and a Cloudflare edge gateway."
              />{" "}
              , is a production-grade{" "}
              <Tooltip
                text="RAG system"
                tooltipText="Retrieval-Augmented Generation: the pattern of injecting relevant document chunks into an LLM's context window to ground its answers in real source material instead of hallucinating."
              />{" "}
              that lets users upload any PDF and have a context-aware,
              history-grounded conversation with it. It is not a demo — it
              ships with a three-tier caching strategy designed to eliminate
              redundant LLM calls entirely.
            </p>

            <p>
              The first cache tier lives at the{" "}
              <Tooltip
                text="Cloudflare edge"
                tooltipText="A TypeScript Cloudflare Worker intercepts every /chat POST before it reaches the origin. It calls Cloudflare's @cf/baai/bge-small-en-v1.5 AI binding for instant query embedding, then checks PostgreSQL for a semantic match."
              />{" "}
              — a TypeScript Worker that intercepts every chat request,
              generates a 384-dimensional query embedding with Cloudflare
              Workers AI ({" "}
              <code className="text-[#3CCF91] bg-[#1a1a1a] px-1 rounded text-xs">
                @cf/baai/bge-small-en-v1.5
              </code>
              ), and checks a{" "}
              <Tooltip
                text="PL/pgSQL cosine-similarity function"
                tooltipText="A custom PostgreSQL function using the pgvector <=> operator to perform Approximate Nearest Neighbour search over pre-computed embeddings, returning a hit if similarity >= 0.85."
              />{" "}
              in PostgreSQL for any semantically equivalent previous answer. A
              cache hit never reaches FastAPI — the cached answer is streamed
              back directly from the edge as a{" "}
              <code className="text-[#3CCF91] bg-[#1a1a1a] px-1 rounded text-xs">
                ReadableStream
              </code>
              , indistinguishable to the client from a live LLM response.
            </p>

            <p>
              The second tier is a{" "}
              <Tooltip
                text="flat-file read cache"
                tooltipText="Each user's full session message list is stored as a JSON file on HuggingFace Space's persistent /data volume. All reads hit disk first; Supabase is only queried on a cold miss. Writes use NamedTemporaryFile + os.replace for POSIX atomicity."
              />{" "}
              on HuggingFace Space&apos;s persistent{" "}
              <code className="text-[#3CCF91] bg-[#1a1a1a] px-1 rounded text-xs">
                /data
              </code>{" "}
              volume. Every session&apos;s message list is serialised as a
              single JSON file using{" "}
              <Tooltip
                text="POSIX-atomic writes"
                tooltipText="NamedTemporaryFile + os.replace: the file is written to a temp path in the same directory, then atomically swapped into place — guaranteeing no partially-written state even if the process crashes mid-write."
              />{" "}
              ({" "}
              <code className="text-[#3CCF91] bg-[#1a1a1a] px-1 rounded text-xs">
                NamedTemporaryFile + os.replace
              </code>
              ). Chat-switch reads cost zero Supabase round-trips.
            </p>

            <p>
              Inside the FastAPI backend, the{" "}
              <Tooltip
                text="LangChain RAG chain"
                tooltipText="A create_history_aware_retriever chain that rephrases ambiguous follow-up questions into standalone queries before hitting pgvector, ensuring retrieval quality doesn't degrade in long conversations."
              />{" "}
              uses{" "}
              <code className="text-[#3CCF91] bg-[#1a1a1a] px-1 rounded text-xs">
                create_history_aware_retriever
              </code>{" "}
              to rephrase ambiguous follow-up questions into standalone queries
              before retrieval — meaning the bot stays coherent across a long
              conversation without leaking one user&apos;s document context
              into another&apos;s (per-user{" "}
              <Tooltip
                text="pgvector filter"
                tooltipText="Every retrieval call passes a {user_id: uuid} metadata filter so PGVector only searches chunks belonging to the authenticated user. Data isolation is enforced at the vector-DB layer, not just in application logic."
              />{" "}
              enforced at the DB layer). The LLM itself is selectable at
              runtime — Groq&apos;s LLaMA 3.3 70B or Qwen 32B for
              low-latency cloud inference, or a local Ollama model for
              completely offline use.
            </p>

            <p>
              Auth is handled by verifying{" "}
              <Tooltip
                text="Supabase HS256 JWTs"
                tooltipText="Every FastAPI endpoint uses a HTTPBearer dependency that decodes the Supabase-signed JWT, extracts the `sub` UUID, and scopes all subsequent DB queries to that UUID — including anonymous users who get a stable UUID too."
              />{" "}
              on every request — both authenticated and anonymous users receive
              a stable UUID{" "}
              <code className="text-[#3CCF91] bg-[#1a1a1a] px-1 rounded text-xs">
                sub
              </code>{" "}
              claim, so the data isolation model is uniform. Uploaded PDFs are
              streamed directly to{" "}
              <Tooltip
                text="Cloudflare R2"
                tooltipText="Object storage compatible with the S3 API. PDFs are uploaded to R2 before text extraction so the origin file is always retrievable from the edge without re-uploading."
              />{" "}
              before text extraction, meaning the origin file is always
              retrievable from the edge.
            </p>

            <p>
              I build the frontend with the same level of care — the landing
              page uses{" "}
              <Tooltip
                text="GSAP and HTML5 Canvas"
                tooltipText="GreenSock Animation Platform drives scroll-triggered effects on the landing page. A Canvas-based animation reflects the AI's live state: Idle, Thinking, and Streaming — each mapped to a distinct visual mode."
              />{" "}
              Canvas animations that reflect the AI&apos;s real-time state
              (Idle / Thinking / Streaming). The application workspace streams
              LLM tokens character-by-character using the{" "}
              <code className="text-[#3CCF91] bg-[#1a1a1a] px-1 rounded text-xs">
                Fetch API reader.read()
              </code>{" "}
              loop, making a cached response and a live response
              indistinguishable from the user&apos;s perspective.
            </p>
          </div>
        </div>

        {/* ── Right column: Photo + Stack matrix ──────────────────────────── */}
        <div className="flex flex-col gap-10">
          <div className="flex justify-center">
            <Image
              src="/assets/3433.png"
              alt="Ayush Gurung — AI Engineer"
              width={220}
              height={220}
              className="rounded-full shadow-[0_4px_24px_rgba(60,207,145,0.18)]"
              priority
            />
          </div>

          {/* Tech stack grid */}
          <div className="text-[#869094] text-sm sm:text-base tracking-tight space-y-5">
            <h3 className="text-white font-semibold text-lg tracking-tighter">
              Technical Depth
            </h3>

            <div className="space-y-3">
              <StackRow
                label="AI / RAG"
                items={[
                  "LangChain",
                  "pgvector",
                  "Sentence-Transformers",
                  "Groq API",
                  "Ollama",
                  "PyMuPDF",
                ]}
              />
              <StackRow
                label="Backend"
                items={[
                  "FastAPI",
                  "Uvicorn",
                  "psycopg3",
                  "Python",
                  "Pydantic v2",
                  "python-jose",
                ]}
              />
              <StackRow
                label="Edge / Infra"
                items={[
                  "Cloudflare Workers",
                  "Workers AI",
                  "Cloudflare KV",
                  "Cloudflare R2",
                  "Docker",
                  "HuggingFace Spaces",
                ]}
              />
              <StackRow
                label="Data"
                items={[
                  "PostgreSQL",
                  "Supabase",
                  "pgvector ANN",
                  "Semantic Cache",
                  "POSIX flat-file cache",
                ]}
              />
              <StackRow
                label="Frontend"
                items={[
                  "Next.js 19",
                  "React 19",
                  "TypeScript",
                  "GSAP",
                  "Canvas API",
                  "Tailwind CSS",
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Internal helper ────────────────────────────────────────────────────────────
const StackRow = ({
  label,
  items,
}: {
  label: string;
  items: string[];
}) => (
  <div className="flex flex-wrap gap-x-4 gap-y-1 items-start">
    <span className="text-[#3CCF91] font-medium w-28 shrink-0">{label}</span>
    <span className="text-[#869094]">{items.join(" · ")}</span>
  </div>
);

export default About;