import { NextResponse } from 'next/server';
import { getBlogDetailsBySlug } from '@/lib/getBlogDetailBySlug';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  const blog = await getBlogDetailsBySlug(slug);

  if (!blog) {
    return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
  }

  const response = NextResponse.json({ blogs: [blog] });
  response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  return response;
}
