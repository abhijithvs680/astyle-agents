/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";

export type SupportedLanguage = "en" | "ja";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isJapanese: boolean;
  isTranslating: boolean;
  t: (key: string, options?: { defaultValue?: string; [key: string]: unknown }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "astyle_lang";

/** Minimum time the loading overlay stays visible so the UI doesn't flash */
const MIN_OVERLAY_MS = 600;

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const [language, setLanguageState] = useState<SupportedLanguage>("en");
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "ja" || stored === "en") {
        setLanguageState(stored);
        if (i18n.language !== stored) {
          i18n.changeLanguage(stored);
        }
      }
    }
  }, [i18n]);

  const setLanguage = useCallback(
    (newLang: SupportedLanguage) => {
      if (newLang === language) return;

      // Show loading overlay immediately
      setIsTranslating(true);
      const start = Date.now();

      setLanguageState(newLang);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, newLang);
      }
      i18n.changeLanguage(newLang);

      // Keep the overlay visible for at least MIN_OVERLAY_MS so React Query
      // translations have time to resolve and the user sees a clean switch.
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_OVERLAY_MS - elapsed);
      setTimeout(() => {
        setIsTranslating(false);
      }, remaining);
    },
    [language, i18n],
  );

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isJapanese: language === "ja",
        isTranslating,
        t: (key: string, options?: { defaultValue?: string; [key: string]: unknown }) =>
          options ? t(key, options) : t(key),
      }}
    >
      {/* Translating overlay: blocks all interaction while switching */}
      {isTranslating && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(234, 245, 248, 0.92)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 40,
                height: 40,
                border: "3px solid #e2e8f0",
                borderTopColor: "#0e7490",
                borderRadius: "50%",
                animation: "spin 0.6s linear infinite",
                margin: "0 auto 12px",
              }}
            />
            <p style={{ color: "#0e7490", fontSize: 14, fontWeight: 600 }}>
              {t("common.translating", { defaultValue: "Translating..." })}
            </p>
          </div>
        </div>
      )}
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
