import translate from "translate";
import { get, set } from "idb-keyval";

// Default engine is Google Translate which supports client-side calls
translate.engine = "google";

// In-memory cache for ultra-fast instant lookups during component lifecycles
const memoryCache = new Map<string, string>();

// In-flight request deduplication to prevent redundant parallel network calls
const inFlightRequests = new Map<string, Promise<string>>();

/**
 * Generate a consistent cache key for a given text and target language
 */
function createCacheKey(text: string, targetLang: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return `trans_${targetLang}_${text.length}_${hash}`;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * Executes translation through a resilient multi-provider pipeline:
 * 1. Google Translate API with Chrome client (bypasses 429 rate limiting on client=gtx)
 * 2. MyMemory Neural Translation API
 * 3. Fallback translate package
 */
async function fetchTranslation(
  text: string,
  targetLang: "en" | "ja",
  fromLang: string,
): Promise<string> {
  // 1. Google Translate API via Chrome extension client
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=${fromLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data: unknown = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const segments = data[0] as Array<[string | null | undefined]>;
        const combined = segments
          .map((s) => (Array.isArray(s) && typeof s[0] === "string" ? s[0] : ""))
          .join("");
        if (combined.trim() !== "") {
          return combined;
        }
      }
    }
  } catch (error) {
    console.warn("[translator] Google client=dict-chrome-ex failed, trying fallback:", error);
  }

  // 2. MyMemory neural translation fallback
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${targetLang}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = (await res.json()) as { responseData?: { translatedText?: string } };
      const translated = data?.responseData?.translatedText;
      if (
        typeof translated === "string" &&
        translated.trim() !== "" &&
        !translated.startsWith("MYMEMORY WARNING")
      ) {
        return decodeHtmlEntities(translated);
      }
    }
  } catch (error) {
    console.warn("[translator] MyMemory fallback failed, trying translate package:", error);
  }

  // 3. Fallback translate npm package
  try {
    const result = await translate(text, { from: fromLang, to: targetLang });
    if (result && typeof result === "string" && result.trim() !== "") {
      return result;
    }
  } catch (error) {
    console.warn("[translator] All translation engines failed:", error);
  }

  throw new Error(`Failed to translate text: "${text.slice(0, 40)}"`);
}

/**
 * Translates a single plain-text string from English to the target language.
 * Checks memory cache -> IndexedDB -> multi-provider translation pipeline.
 */
export async function translateText(
  text: string,
  targetLang: "en" | "ja" = "ja",
  fromLang: string = "en",
): Promise<string> {
  const trimmed = text?.trim();
  if (!trimmed || targetLang === "en" || targetLang === fromLang) {
    return text;
  }

  // Pure numbers, currencies or symbols don't need translation
  if (/^[\d\s€$¥£.,%+\-*/:=<>#_]+$/.test(trimmed)) {
    return text;
  }

  // If text is already primarily Japanese, skip translation
  if (targetLang === "ja" && /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(trimmed)) {
    const latinCount = (trimmed.match(/[a-zA-Z]/g) || []).length;
    const jaCount = (trimmed.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/g) || []).length;
    if (jaCount > latinCount && latinCount < 5) {
      return text;
    }
  }

  const cacheKey = createCacheKey(trimmed, targetLang);

  // 1. Check in-memory cache
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)!;
  }

  // 2. Check IndexedDB persistent browser cache
  try {
    const persisted = await get<string>(cacheKey);
    if (persisted) {
      memoryCache.set(cacheKey, persisted);
      return persisted;
    }
  } catch {
    // If IndexedDB is blocked or throws, fall through to live translation
  }

  // 3. Deduplicate in-flight requests for the exact same text
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey)!;
  }

  const promise = (async () => {
    try {
      const result = await fetchTranslation(trimmed, targetLang, fromLang);
      if (result && typeof result === "string") {
        memoryCache.set(cacheKey, result);
        try {
          await set(cacheKey, result);
        } catch {
          // Silently ignore quota / private browsing storage errors
        }
        return result;
      }
    } catch (error) {
      console.warn("[translator] Dynamic translation fallback to original:", error);
    } finally {
      inFlightRequests.delete(cacheKey);
    }
    return text;
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

/**
 * Translates markdown content while preserving code blocks and technical tokens
 */
export async function translateMarkdown(
  markdown: string,
  targetLang: "en" | "ja" = "ja",
): Promise<string> {
  if (!markdown || targetLang === "en") {
    return markdown;
  }

  // Preserve fenced code blocks: ```lang ... ```
  const codeBlocks: string[] = [];
  const placeholderMarkdown = markdown.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `\n\n__CODE_BLOCK_${codeBlocks.length - 1}__\n\n`;
  });

  // Preserve inline code: `code`
  const inlineCodes: string[] = [];
  const sanitizedMarkdown = placeholderMarkdown.replace(/`[^`]+`/g, (match) => {
    inlineCodes.push(match);
    return `__INLINE_CODE_${inlineCodes.length - 1}__`;
  });

  // Split into paragraphs/sections to translate smoothly
  const paragraphs = sanitizedMarkdown.split(/\n\n+/);
  const translatedParagraphs = await Promise.all(
    paragraphs.map(async (paragraph) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return paragraph;
      // Skip placeholders alone
      if (/^__CODE_BLOCK_\d+__$/.test(trimmed)) return trimmed;

      return await translateText(paragraph, targetLang);
    }),
  );

  let reconstructed = translatedParagraphs.join("\n\n");

  // Restore inline codes
  inlineCodes.forEach((inlineCode, i) => {
    reconstructed = reconstructed.replaceAll(`__INLINE_CODE_${i}__`, inlineCode);
  });

  // Restore code blocks
  codeBlocks.forEach((codeBlock, i) => {
    reconstructed = reconstructed.replaceAll(`__CODE_BLOCK_${i}__`, codeBlock);
  });

  return reconstructed;
}
