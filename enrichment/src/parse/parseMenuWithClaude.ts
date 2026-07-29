import Anthropic from '@anthropic-ai/sdk';
import { MENU_PARSE_SYSTEM_PROMPT, buildMenuParseUserMessage } from './prompt.js';
import type { ParsedMenuItem } from '../types.js';

// claude-opus-5 per this project's `claude-api` skill defaults — never
// silently downgrade model tier for cost. `effort: "low"` is a separate,
// legitimate per-request lever for this narrow, well-specified extraction
// task, recommended even at low effort for Opus 5-tier models.
const MODEL = 'claude-opus-5';
const MAX_INPUT_CHARS = 6000;
const MIN_TEXT_LENGTH = 200;

const REPORT_MENU_ITEMS_TOOL: Anthropic.Tool = {
  name: 'report_menu_items',
  description: 'Report the structured list of menu items extracted from the scraped text.',
  input_schema: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            ingredients: { type: 'array', items: { type: 'string' } },
            price: { type: 'number' },
          },
          required: ['name', 'ingredients'],
        },
      },
    },
    required: ['items'],
  },
};

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

function truncateForBudget(text: string): string {
  return text.length <= MAX_INPUT_CHARS ? text : text.slice(0, MAX_INPUT_CHARS);
}

function parseToolInput(input: unknown): ParsedMenuItem[] {
  if (typeof input !== 'object' || input === null) return [];
  const items = (input as { items?: unknown }).items;
  if (!Array.isArray(items)) return [];

  const parsed: ParsedMenuItem[] = [];
  for (const raw of items) {
    if (typeof raw !== 'object' || raw === null) continue;
    const item = raw as Record<string, unknown>;
    if (typeof item.name !== 'string' || !Array.isArray(item.ingredients)) continue;
    const ingredients = item.ingredients.filter((i): i is string => typeof i === 'string');
    if (ingredients.length === 0) continue;
    parsed.push({
      name: item.name,
      ingredients,
      ...(typeof item.price === 'number' ? { price: item.price } : {}),
    });
  }
  return parsed;
}

export async function parseMenuWithClaude(
  restaurantName: string,
  city: string,
  scrapedText: string,
): Promise<ParsedMenuItem[]> {
  if (scrapedText.trim().length < MIN_TEXT_LENGTH) return [];

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 1536,
    output_config: { effort: 'low' },
    system: MENU_PARSE_SYSTEM_PROMPT,
    tools: [REPORT_MENU_ITEMS_TOOL],
    tool_choice: { type: 'tool', name: 'report_menu_items' },
    messages: [
      {
        role: 'user',
        content: buildMenuParseUserMessage(restaurantName, city, truncateForBudget(scrapedText)),
      },
    ],
  });

  // Defensive: Opus 5's safety classifiers can rarely decline (stop_reason
  // "refusal"), returning HTTP 200 with no usable tool_use block. Treat as
  // "no items found" rather than throwing.
  if (response.stop_reason === 'refusal') return [];

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use' && block.name === 'report_menu_items',
  );
  if (!toolUse) return [];

  return parseToolInput(toolUse.input);
}
