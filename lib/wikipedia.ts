import { WikiApiResponse } from './types';

const WIKI_API = 'https://en.wikipedia.org/w/api.php';

export async function fetchArticle(title: string): Promise<WikiApiResponse> {
  const params = new URLSearchParams({
    action: 'parse',
    page: title,
    prop: 'text|displaytitle',
    disableeditsection: '1',
    disabletoc: '0',
    format: 'json',
    origin: '*',
  });

  const res = await fetch(`${WIKI_API}?${params}`);
  if (!res.ok) {
    throw new Error(`Wikipedia API error: ${res.status}`);
  }
  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.info || 'Unknown Wikipedia API error');
  }

  const html = data.parse?.text?.['*'] || '';
  const displayTitle = data.parse?.displaytitle || title;

  let summary = '';
  try {
    const summaryRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    );
    if (summaryRes.ok) {
      const summaryData = await summaryRes.json();
      summary = summaryData.extract || '';
    }
  } catch {
    // summary is optional
  }

  return { title: displayTitle, content: html, summary };
}

export async function searchArticles(query: string): Promise<string[]> {
  const params = new URLSearchParams({
    action: 'opensearch',
    search: query,
    limit: '8',
    namespace: '0',
    format: 'json',
    origin: '*',
  });

  const res = await fetch(`${WIKI_API}?${params}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data[1] || [];
}

export function getRandomArticlePairs(): { start: string; target: string }[] {
  return [
    { start: 'Albert_Einstein', target: 'Pizza' },
    { start: 'World_War_II', target: 'Coffee' },
    { start: 'Moon', target: 'Shakespeare' },
    { start: 'Internet', target: 'Ancient_Rome' },
    { start: 'Eiffel_Tower', target: 'Quantum_mechanics' },
    { start: 'Dinosaur', target: 'Jazz' },
    { start: 'Olympics', target: 'Black_hole' },
    { start: 'Napoleon', target: 'Sushi' },
  ];
}

export function pickRandomPair(): { start: string; target: string } {
  const pairs = getRandomArticlePairs();
  return pairs[Math.floor(Math.random() * pairs.length)];
}
