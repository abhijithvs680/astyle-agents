import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en } from "./locales/en";
import { ja } from "./locales/ja";

const savedLanguage = typeof window !== "undefined" ? localStorage.getItem("astyle_lang") : null;
const initialLanguage = savedLanguage === "ja" ? "ja" : "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ja: { translation: ja },
    },
    lng: initialLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
