"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { LoginForm } from "./LoginForm";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

type AuthContextValue = {
  session: Session | null;
  isGuest: boolean;
  setGuest: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthGate");
  }
  return ctx;
}

const GUEST_KEY = "laclef-guest";

export function AuthGate({ children }: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    const guest = typeof window !== "undefined" && window.localStorage.getItem(GUEST_KEY) === "1";
    setIsGuest(guest);

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      setSession(next);
      setLoading(false);
      if (next) {
        window.localStorage.removeItem(GUEST_KEY);
        setIsGuest(false);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  function setGuest(value: boolean) {
    if (value) {
      window.localStorage.setItem(GUEST_KEY, "1");
      setIsGuest(true);
    } else {
      window.localStorage.removeItem(GUEST_KEY);
      setIsGuest(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Chargement...
      </div>
    );
  }

  if (!session && !isGuest) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <LoginForm
          onGuest={() => {
            setGuest(true);
            if (pathname !== "/") window.location.href = "/";
          }}
        />
      </div>
    );
  }

  if (isGuest && pathname !== "/") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <LoginForm
          onGuest={() => {
            setGuest(true);
            if (pathname !== "/") window.location.href = "/";
          }}
        />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session, isGuest, setGuest }}>
      {children}
    </AuthContext.Provider>
  );
}
