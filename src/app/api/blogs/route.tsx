import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Cache the response for 1 hour
const CACHE_DURATION = 60 * 60; // 1 hour in seconds

export async function GET() {
  try {
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('id, title, summary, date, read_time')
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create response with cache headers
    const response = NextResponse.json(blogs || []);
    
    // Add cache headers for better performance
    response.headers.set('Cache-Control', `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`);
    response.headers.set('CDN-Cache-Control', `public, s-maxage=${CACHE_DURATION}`);
    response.headers.set('Vercel-CDN-Cache-Control', `public, s-maxage=${CACHE_DURATION}`);

    return response;
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}