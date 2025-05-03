// app/api/blogs/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const blogs = [
    {
      id: 1,
      title: '2024 Retrospective',
      summary: 'January 21 2025 • 6 min read',
    },
    {
      id: 2,
      title: 'Unleash Your Dev Blog: Write More with GitHub Issues as Your CMS',
      summary: 'April 2 2024 • 3 min read',
    },
    {
      id: 3,
      title: 'Code Faster with Vim Shortcuts!',
      summary: 'July 18 2022 • 2 min read',
    },
    {
      id: 4,
      title: 'Easily Boost Your Productivity With Code Snippets',
      summary: 'September 22 2021 • 3 min read',
    },
  ];

  return NextResponse.json(blogs);
}
