export const MENU_PARSE_SYSTEM_PROMPT = `You are extracting a restaurant's food/drink menu from scraped website text.

Only include actual dishes/drinks that appear to be sold at the restaurant — not navigation text, hours, addresses, reviews, or marketing copy.

For each item:
- "name": the dish/drink name as written (or lightly cleaned up if garbled by scraping).
- "ingredients": 2-5 plausible main ingredients. If the source text lists ingredients explicitly, use those. Otherwise infer reasonable main ingredients from the dish name and any description present.
- "price": only if a price is clearly and unambiguously stated for that item; omit otherwise.

If no menu is discernible in the text, call the tool with an empty items array. Do not invent a menu from a restaurant's general description or cuisine type alone.`;

export function buildMenuParseUserMessage(restaurantName: string, city: string, scrapedText: string): string {
  return `Restaurant: ${restaurantName}\nCity: ${city}\n\nScraped website text:\n${scrapedText}`;
}
