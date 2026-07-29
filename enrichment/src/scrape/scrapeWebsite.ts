import * as cheerio from 'cheerio';
import { isDisallowed } from './robotsCheck.js';
import { extractPdfText } from './pdfExtract.js';
import type { ScrapeResult } from '../types.js';

const MENU_KEYWORDS = ['menu', 'carte', 'kaart', 'speisekarte', 'gerechten', 'plats'];
const FETCH_TIMEOUT_MS = 10_000;
const USER_AGENT = 'FoodMapEnrichmentBot/1.0 (+https://github.com/waterloolou/food-map)';
const MAX_LINKS_TO_FOLLOW = 2;
const MAX_PDFS_TO_FOLLOW = 2;

type FetchOutcome = { ok: true; html: string } | { ok: false; reason: 'blocked' | 'timeout' | 'dead-link' };

async function fetchText(url: string): Promise<FetchOutcome> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      redirect: 'follow',
    });
    if (response.status === 403 || response.status === 429) return { ok: false, reason: 'blocked' };
    if (!response.ok) return { ok: false, reason: 'dead-link' };
    return { ok: true, html: await response.text() };
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') return { ok: false, reason: 'timeout' };
    return { ok: false, reason: 'dead-link' };
  }
}

function extractVisibleText($: cheerio.CheerioAPI): string {
  $('script, style, nav, footer, header, noscript').remove();
  return $('body').text().replace(/\s+/g, ' ').trim();
}

function findCandidateLinks(
  $: cheerio.CheerioAPI,
  baseUrl: string,
): { menuPages: string[]; pdfs: string[] } {
  const origin = new URL(baseUrl).origin;
  const menuPages = new Set<string>();
  const pdfs = new Set<string>();

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;

    let absolute: URL;
    try {
      absolute = new URL(href, baseUrl);
    } catch {
      return;
    }
    if (absolute.origin !== origin) return;

    const haystack = `${$(el).text()} ${absolute.pathname}`.toLowerCase();
    if (!MENU_KEYWORDS.some((kw) => haystack.includes(kw))) return;

    if (absolute.pathname.toLowerCase().endsWith('.pdf')) {
      pdfs.add(absolute.toString());
    } else {
      menuPages.add(absolute.toString());
    }
  });

  return {
    menuPages: [...menuPages].slice(0, MAX_LINKS_TO_FOLLOW),
    pdfs: [...pdfs].slice(0, MAX_PDFS_TO_FOLLOW),
  };
}

export async function scrapeWebsite(websiteUrl: string): Promise<ScrapeResult> {
  if (await isDisallowed(websiteUrl)) return { status: 'robots-disallowed' };

  const homepage = await fetchText(websiteUrl);
  if (!homepage.ok) return { status: homepage.reason };

  const $ = cheerio.load(homepage.html);
  const texts = [extractVisibleText($)];
  const { menuPages, pdfs } = findCandidateLinks($, websiteUrl);

  for (const pageUrl of menuPages) {
    if (await isDisallowed(pageUrl)) continue;
    const page = await fetchText(pageUrl);
    if (page.ok) texts.push(extractVisibleText(cheerio.load(page.html)));
  }

  for (const pdfUrl of pdfs) {
    if (await isDisallowed(pdfUrl)) continue;
    const text = await extractPdfText(pdfUrl);
    if (text) texts.push(text);
  }

  const combined = texts.join('\n\n').trim();
  return combined.length > 0 ? { status: 'ok', text: combined } : { status: 'empty' };
}
