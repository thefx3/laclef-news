"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthGate";
import { Modal } from "@/components/calendar/Modal";

type UserProfileRow = {
  user_id: string;
  email: string | null;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  created_at: string;
};

export default function UsersPage() {
  const { session, isGuest } = useAuth();
  const [users, setUsers] = useState<UserProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<UserProfileRow["role"] | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<UserProfileRow["role"]>("USER");
  const [editingUser, setEditingUser] = useState<UserProfileRow | null>(null);
  const [editingRole, setEditingRole] = useState<UserProfileRow["role"]>("USER");

  async function loadUsers(active: { value: boolean }) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("user_id,email,role,created_at")
      .order("created_at", { ascending: false });

    if (!active.value) return;
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setUsers((data as UserProfileRow[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    const active = { value: true };
    setLoading(true);
    setError(null);
    void loadUsers(active);

    return () => {
      active.value = false;
    };
  }, []);

  useEffect(() => {
    if (!session) return;
    supabase
      .from("user_profiles")
      .select("role")
      .eq("user_id", session.user.id)
      .single()
      .then(({ data }) => {
        if (data?.role) setCurrentRole(data.role);
      });
  }, [session]);

  async function callAdminApi(
    method: "POST" | "PATCH" | "DELETE",
    body: Record<string, unknown>
  ) {
    if (!session) return;
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;

    const res = await fetch("/api/admin/users", {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? "Erreur serveur");
    }
  }

  const isAdmin = currentRole === "ADMIN" || currentRole === "SUPER_ADMIN";
  const isSuperAdmin = currentRole === "SUPER_ADMIN";

  return (
    <div className="flex flex-1 flex-col gap-4 w-full mx-auto font-sans p-2">
      <main className="flex w-full flex-col justify-between py-2 items-start">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
          Utilisateurs
        </h1>
      </main>

      {isGuest && (
        <p className="text-sm text-amber-700">
          Mode invité : création/modification d&apos;utilisateurs désactivée.
        </p>
      )}

      {isAdmin && (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Créer un compte
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <input
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
            />
            <select
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserProfileRow["role"])}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            </select>
          </div>
          <button
            className="mt-3 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={async () => {
              try {
                await callAdminApi("POST", {
                  email: newEmail,
                  password: newPassword,
                  role: newRole,
                });
                setNewEmail("");
                setNewPassword("");
                setNewRole("USER");
                setLoading(true);
                await loadUsers({ value: true });
              } catch (err) {
                setError((err as Error).message);
              }
            }}
          >
            Créer
          </button>
        </section>
      )}

      {loading && <p className="text-sm text-gray-500">Chargement...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Rôle</th>
                <th className="px-4 py-3 text-left">Créé le</th>
                {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.user_id} className="text-gray-800">
                  <td className="px-4 py-3">{user.email ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-gray-600">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(user.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline disabled:text-gray-400 disabled:no-underline"
                          disabled={!isSuperAdmin && user.role === "SUPER_ADMIN"}
                          onClick={() => {
                            setEditingUser(user);
                            setEditingRole(user.role);
                          }}
                        >
                          Modifier
                        </button>
                        <button
                          className="text-xs font-semibold text-red-600 hover:text-red-700 underline disabled:text-gray-400 disabled:no-underline"
                          disabled={!isSuperAdmin && user.role === "SUPER_ADMIN"}
                          onClick={async () => {
                            try {
                              await callAdminApi("DELETE", { user_id: user.user_id });
                              setUsers((prev) =>
                                prev.filter((u) => u.user_id !== user.user_id)
                              );
                            } catch (err) {
                              setError((err as Error).message);
                            }
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-gray-500"
                    colSpan={isAdmin ? 4 : 3}
                  >
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editingUser && (
        <Modal
          onClose={() => {
            setEditingUser(null);
          }}
        >
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Utilisateur</p>
              <p className="text-sm font-semibold text-gray-900">
                {editingUser.email ?? "—"}
              </p>
            </div>
            <label className="block text-sm font-semibold text-gray-900">
              Rôle
              <select
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={editingRole}
                onChange={(e) =>
                  setEditingRole(e.target.value as UserProfileRow["role"])
                }
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                {isSuperAdmin && <option value="SUPER_ADMIN">SUPER_ADMIN</option>}
              </select>
            </label>
            <div className="flex items-center justify-end gap-3">
              <button
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setEditingUser(null)}
                type="button"
              >
                Annuler
              </button>
              <button
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={async () => {
                  try {
                    await callAdminApi("PATCH", {
                      user_id: editingUser.user_id,
                      role: editingRole,
                    });
                    setUsers((prev) =>
                      prev.map((u) =>
                        u.user_id === editingUser.user_id
                          ? { ...u, role: editingRole }
                          : u
                      )
                    );
                    setEditingUser(null);
                  } catch (err) {
                    setError((err as Error).message);
                  }
                }}
                type="button"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
