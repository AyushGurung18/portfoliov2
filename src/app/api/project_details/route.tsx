import { NextResponse } from "next/server";
import { getProjectDetailsBySlug } from "@/lib/getProjectDetailBySlug";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({
        error: "Missing slug parameter",
        errorType: "bad_request"
      }, { status: 400 });
    }

    const project = await getProjectDetailsBySlug(slug);

    if (!project) {
      return NextResponse.json({
        error: `Project "${slug}" not found`,
        errorType: "not_found",
        slug
      }, { status: 404 });
    }

    const response = NextResponse.json({ project: [project] });
    response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return response;
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      error: "Internal server error",
      errorType: "server_error"
    }, { status: 500 });
  }
}
