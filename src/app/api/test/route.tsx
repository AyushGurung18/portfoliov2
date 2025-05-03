import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await supabase.from('projects').select('*');

  if (error) {
    return NextResponse.json({ error: 'Error fetching data from Supabase' }, { status: 500 });
  }
  return NextResponse.json(data);
}
