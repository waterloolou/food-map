const robotsCache = new Map<string, string[]>();

async function fetchDisallowRules(origin: string): Promise<string[]> {
  if (robotsCache.has(origin)) return robotsCache.get(origin)!;

  let rules: string[] = [];
  try {
    const response = await fetch(new URL('/robots.txt', origin).toString(), {
      signal: AbortSignal.timeout(8_000),
    });
    if (response.ok) {
      const body = await response.text();
      rules = parseGlobalDisallowRules(body);
    }
  } catch {
    // Unreachable robots.txt is treated as "no restrictions" — not a hard failure.
  }

  robotsCache.set(origin, rules);
  return rules;
}

// Deliberately basic: only honors rules under a "User-agent: *" block (or our
// own UA if explicitly named), and only exact-prefix Disallow matching — no
// wildcard/$ support, no Allow-precedence resolution. Good-faith politeness,
// not a full robots.txt parser.
export function parseGlobalDisallowRules(robotsTxt: string): string[] {
  const lines = robotsTxt.split(/\r?\n/).map((l) => l.trim());
  const disallows: string[] = [];
  let inRelevantBlock = false;

  for (const line of lines) {
    const [rawKey, ...rest] = line.split(':');
    if (!rawKey || rest.length === 0) continue;
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(':').trim();

    if (key === 'user-agent') {
      inRelevantBlock = value === '*' || value.toLowerCase() === 'food-map-enrichment-bot';
    } else if (key === 'disallow' && inRelevantBlock && value) {
      disallows.push(value);
    }
  }

  return disallows;
}

export async function isDisallowed(url: string): Promise<boolean> {
  const parsed = new URL(url);
  const rules = await fetchDisallowRules(parsed.origin);
  return rules.some((rule) => parsed.pathname.startsWith(rule));
}
