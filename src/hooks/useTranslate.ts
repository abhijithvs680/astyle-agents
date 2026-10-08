import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../context/LanguageContext";
import { translateText, translateMarkdown } from "../lib/translator";

/**
 * Hook to translate a dynamic plain string based on active UI language
 */
export function useTranslate(text: string | undefined | null) {
  const { language } = useLanguage();

  const query = useQuery({
    queryKey: ["dynamic-translation", language, text],
    queryFn: () => translateText(text ?? "", language),
    enabled: Boolean(text && text.trim().length > 0) && language === "ja",
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24, // 24 hours in memory
    placeholderData: (prev) => prev ?? text ?? "",
  });

  if (language === "en" || !text) {
    return {
      text: text ?? "",
      isLoading: false,
    };
  }

  return {
    text: query.data || text,
    isLoading: query.isLoading,
  };
}

/**
 * Hook to translate dynamic markdown content while preserving code and structure
 */
export function useTranslateMarkdown(markdown: string | undefined | null) {
  const { language } = useLanguage();

  const query = useQuery({
    queryKey: ["dynamic-markdown", language, markdown],
    queryFn: () => translateMarkdown(markdown ?? "", language),
    enabled: Boolean(markdown && markdown.trim().length > 0) && language === "ja",
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    placeholderData: (prev) => prev ?? markdown ?? "",
  });

  if (language === "en" || !markdown) {
    return {
      markdown: markdown ?? "",
      isLoading: false,
    };
  }

  return {
    markdown: query.data || markdown,
    isLoading: query.isLoading,
  };
}
