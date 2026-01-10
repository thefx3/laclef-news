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
      setMessage(error.message);
      return;
    }
    onSuccess?.();
  }

  return (
    <div className="w-full max-w-sm space-y-3">
      <h1 className="text-xl font-bold text-gray-900">Connexion</h1>
      {message && <p className="text-sm text-red-600">{message}</p>}
      <input
        className="border p-2 w-full rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        className="border p-2 w-full rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        type="password"
      />
      <div className="flex gap-2">
        <button className="border px-3 py-2 rounded" onClick={signIn}>
          Connexion
        </button>
        <button className="border px-3 py-2 rounded" onClick={signUp}>
          Créer compte
        </button>
        {onGuest && (
          <button className="border px-3 py-2 rounded" onClick={onGuest}>
            Invité
          </button>
        )}
      </div>
    </div>
  );
}
