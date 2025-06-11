  import { NextResponse } from 'next/server';
  import { supabase } from '@/lib/supabaseClient';

  export async function GET() {
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('id, title, summary, date , read_time')
      .order('id', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(blogs);
  }
