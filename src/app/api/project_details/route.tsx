import { NextResponse } from "next/server";
import { getProjectDetailsBySlug } from "@/lib/getProjectDetailBySlug";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const project = await getProjectDetailsBySlug(slug);
  if (!project) {
    return NextResponse.json({ error: `Project "${slug}" not found` }, { status: 404 });
  }

  const response = NextResponse.json({ project });
  response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  return response;
}
