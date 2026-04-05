"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "create" | "edit";

type UserFormProps = {
  mode: Mode;
  initial?: {
    id:       string;
    username: string | null;
    name:     string | null;
    email:    string | null;
    role:     string;
  };
  currentUserId: string;
};

export default function UserForm({ mode, initial, currentUserId }: UserFormProps) {
  const router = useRouter();

  const [username, setUsername] = useState(initial?.username ?? "");
  const [name,     setName]     = useState(initial?.name     ?? "");
  const [email,    setEmail]    = useState(initial?.email    ?? "");
  const [role,     setRole]     = useState(initial?.role     ?? "admin");
  const [password, setPassword] = useState("");

  const [saving,  setSaving]  = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const isSelf    = mode === "edit" && initial?.id === currentUserId;
  const isCreate  = mode === "create";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const body: Record<string, string> = { username, name, email, role };
      if (isCreate || password) body.newPassword = password;
      if (isCreate) body.password = password;

      const url    = isCreate ? "/api/users" : `/api/users/${initial!.id}`;
      const method = isCreate ? "POST" : "PATCH";

      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(isCreate ? { username, name, email, role, password } : { username, name, email, role, newPassword: password || undefined }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Error al guardar."); return; }

      router.push("/admin/users");
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar al usuario "${initial?.username}"? Esta acción es irreversible.`)) return;
    setError(null);
    setDeleting(true);

    try {
      const res  = await fetch(`/api/users/${initial!.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Error al eliminar."); return; }

      router.push("/admin/users");
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setDeleting(false);
    }
  }

  const inputCls = "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">

      <div>
        <label htmlFor="username" className={labelCls}>Usuario *</label>
        <input
          id="username" type="text" required autoComplete="off"
          value={username} onChange={(e) => setUsername(e.target.value)}
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="name" className={labelCls}>Nombre (opcional)</label>
        <input
          id="name" type="text" autoComplete="off"
          value={name} onChange={(e) => setName(e.target.value)}
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="email" className={labelCls}>Email (opcional)</label>
        <input
          id="email" type="email" autoComplete="off"
          value={email} onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="role" className={labelCls}>Rol</label>
        <select
          id="role"
          value={role} onChange={(e) => setRole(e.target.value)}
          className={inputCls}
        >
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
      </div>

      <div>
        <label htmlFor="password" className={labelCls}>
          {isCreate ? "Contraseña *" : "Nueva contraseña (dejar en blanco para no cambiar)"}
        </label>
        <input
          id="password" type="password" autoComplete="new-password"
          required={isCreate}
          value={password} onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white text-sm px-5 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-60 transition-colors"
        >
          {saving ? "Guardando…" : isCreate ? "Crear usuario" : "Guardar cambios"}
        </button>

        {mode === "edit" && !isSelf && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-red-600 hover:text-red-800 disabled:opacity-60 transition-colors"
          >
            {deleting ? "Eliminando…" : "Eliminar usuario"}
          </button>
        )}
      </div>

    </form>
  );
}
