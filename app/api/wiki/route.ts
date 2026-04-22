import { NextRequest, NextResponse } from 'next/server';

const WIKI_API = 'https://en.wikipedia.org/w/api.php';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const action = searchParams.get('action') || 'parse';

  if (!title) {
    return NextResponse.json({ error: 'Missing title parameter' }, { status: 400 });
  }

  // Sanitize title: allow only valid Wikipedia article characters
  const safeTitle = decodeURIComponent(title)
    .replace(/[<>"'&]/g, '')
    .replace(/[^\w\s\-.()',/]/g, '')
    .substring(0, 200)
    .trim();

  if (action === 'search') {
    const params = new URLSearchParams({
      action: 'opensearch',
      search: safeTitle,
      limit: '8',
      namespace: '0',
      format: 'json',
      origin: '*',
    });
    const res = await fetch(`${WIKI_API}?${params}`, {
      headers: { 'User-Agent': 'WikiSearchGame/1.0' },
    });
    const data = await res.json();
    return NextResponse.json({ results: data[1] || [] });
  }

  const params = new URLSearchParams({
    action: 'parse',
    page: safeTitle,
    prop: 'text|displaytitle',
    disableeditsection: '1',
    format: 'json',
    origin: '*',
  });

  try {
    const res = await fetch(`${WIKI_API}?${params}`, {
      headers: { 'User-Agent': 'WikiSearchGame/1.0' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Wikipedia API error' }, { status: res.status });
    }

    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.info || 'Article not found' }, { status: 404 });
    }

    const html = data.parse?.text?.['*'] || '';
    const displayTitle = data.parse?.displaytitle || safeTitle;

    return NextResponse.json({ title: displayTitle, content: html, summary: '' });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}
