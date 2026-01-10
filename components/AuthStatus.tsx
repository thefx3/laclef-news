"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthGate";

export function AuthStatus() {
  const { session, isGuest, setGuest } = useAuth();

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  if (isGuest) {
    return (
      <div className="flex items-center gap-3 text-xs text-gray-600">
        <span>Mode invité</span>
        <button
          className="font-semibold text-red-600 hover:text-red-700 underline cursor-pointer"
          onClick={() => setGuest(false)}
        >
          Quitter
        </button>
      </div>
    );
  }

  if (!session) {
    return (
      <Link className="text-xs font-semibold text-blue-700 underline cursor-pointer" href="/login">
        Se connecter
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 text-xs text-gray-600">
      <span>Connecté : {session.user.email}</span>
      <button
        className="font-semibold text-red-600 hover:text-red-700 underline cursor-pointer"
        onClick={handleSignOut}
      >
        Déconnexion
      </button>
    </div>
  );
}
