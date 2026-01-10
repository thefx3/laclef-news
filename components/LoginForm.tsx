"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  onSuccess?: () => void;
  onGuest?: () => void;
};

export function LoginForm({ onSuccess, onGuest }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function signUp() {
    setMessage(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage("Compte créé. Tu peux te connecter.");
  }

  async function signIn() {
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const msg =
        error.message === "missing email or phone"
          ? "Merci d’indiquer un email et/ou un mot de passe."
          : error.message;
      setMessage(msg);
      return;
    }
    
    onSuccess?.();
  }

  return (
    <div className="w-full max-w-md space-y-5 rounded-2xl border border-black/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.6)]">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-black">Connexion</h1>
      </div>
      {message && (
        <div className="rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm text-black">
          {message}
        </div>
      )}
      <label className="block space-y-2 text-sm font-medium text-black/70">
        Email
        <input
          className="w-full rounded-xl border border-black/15 bg-white px-4 py-2 mt-2 text-sm text-black shadow-sm outline-none transition focus:border-black/40 focus:ring-2 focus:ring-black/10"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="prenom.nom@laclef.fr"
          type="email"
          autoComplete="email"
        />
      </label>
      <label className="block space-y-2 text-sm font-medium text-black/70">
        Mot de passe
        <input
          className="w-full rounded-xl border border-black/15 bg-white px-4 py-2 mt-2 text-sm text-black shadow-sm outline-none transition focus:border-black/40 focus:ring-2 focus:ring-black/10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          type="password"
          autoComplete="current-password"
        />
      </label>
      <div className="flex flex-col gap-2 pt-2">
        <button
          className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-black/90"
          onClick={signIn}
        >
          Connexion
        </button>
        <div className="flex flex-wrap gap-2">
          {onGuest && (
            <button
              className="flex-1 rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-black/70 transition hover:border-black/30 hover:bg-black/5"
              onClick={onGuest}
            >
              Continuer en invité
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
