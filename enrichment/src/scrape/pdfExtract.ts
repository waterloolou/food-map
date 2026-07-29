import pdfParse from 'pdf-parse';

const MAX_PDF_BYTES = 5 * 1024 * 1024;

export async function extractPdfText(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    if (!response.ok) return null;

    const contentLength = Number(response.headers.get('content-length') ?? '0');
    if (contentLength > MAX_PDF_BYTES) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength > MAX_PDF_BYTES) return null;

    const parsed = await pdfParse(buffer);
    return parsed.text.trim() || null;
  } catch {
    return null;
  }
}
