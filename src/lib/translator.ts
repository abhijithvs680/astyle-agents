import translate from "translate";
import { get, set } from "idb-keyval";

// Default engine is Google Translate (gtx) which supports client-side calls without an API key
translate.engine = "google";

// In-memory cache for ultra-fast instant lookups during component lifecycles
const memoryCache = new Map<string, string>();

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

/**
 * Translates a single plain-text string from English to the target language.
 * Checks memory cache -> IndexedDB -> translation library.
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

  // 3. Perform translation using translate.js
  try {
    const result = await translate(trimmed, { from: fromLang, to: targetLang });

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
  }

  return text;
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
