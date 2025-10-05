"use client";
import { addLocale, useLocale } from "ttag";
import { t } from "ttag";
import { useSyncExternalStore } from "react";

export const SUPPORTED = ["en", "vi", "ko"];

let currentLang = "en";
const listeners = new Set();

const emit = () => listeners.forEach((cb) => { try { cb(); } catch {} });

export const subscribeToLanguageChange = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const useI18nLang = () =>
  useSyncExternalStore(
    subscribeToLanguageChange,
    () => currentLang, // client
    () => currentLang  // ssr fallback
  );

export const getCurrentLanguage = () => {
  const saved = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
  if (saved && SUPPORTED.includes(saved)) return saved;
  const browser =
    (typeof navigator !== "undefined" ? navigator.language : "en").split("-")[0];
  return SUPPORTED.includes(browser) ? browser : "en";
};

const loadLanguage = async (lang = "en") => {
  const res = await fetch(`/locales/${lang}.po.json`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${lang}`);
  addLocale(lang, await res.json());
};

export const initI18n = async () => {
  let lang = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
  if (!lang || !SUPPORTED.includes(lang)) lang = getCurrentLanguage();
  await setLanguage(lang);
};

export const setLanguage = async (lang) => {
  await loadLanguage(lang);
  currentLang = lang;
  localStorage.setItem("lang", lang);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLocale(lang);
  emit(); // thông báo để UI re-render
};

// Export t function
export { t };
