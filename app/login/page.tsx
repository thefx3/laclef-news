"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Compte créé. Tu peux te connecter.");
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.href = "/"; // ou router.push("/")
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  return (
    <div className="max-w-sm space-y-3">
      <input className="border p-2 w-full" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <input className="border p-2 w-full" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mot de passe" type="password" />
      <div className="flex gap-2">
        <button className="border px-3 py-2" onClick={signIn}>Connexion</button>
        <button className="border px-3 py-2" onClick={signUp}>Créer compte</button>
        <button className="border px-3 py-2" onClick={signOut}>Déconnexion</button>
      </div>
    </div>
  );
}
