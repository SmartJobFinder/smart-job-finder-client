"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authHydrated, meThunk } from "@/features/auth/authSlice";
import { initI18n, subscribeToLanguageChange } from "@/i18n/i18n";

const STORAGE_KEY = "authState";

const safeParse = (raw) => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const AppInitializer = () => {
  const dispatch = useDispatch();
  const { hydrated, user } = useSelector((s) => s.auth);
  const didInit = useRef(false);

  const [, force] = useState(0);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    (async () => {
      await initI18n();
      force((x) => x + 1);
    })();

    dispatch(meThunk());
  }, [dispatch]);

  useEffect(() => {
    const unsub = subscribeToLanguageChange(() => force((x) => x + 1));
    return () => unsub?.();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }, [hydrated, user]);

  return null;
};

export default AppInitializer;
