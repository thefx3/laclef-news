import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function requireAdmin(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return { error: "Missing token", status: 401 } as const;
  }
  const token = auth.replace("Bearer ", "");
  const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
  if (userErr || !userData.user) {
    return { error: "Invalid token", status: 401 } as const;
  }

  const { data: profile, error: profileErr } = await supabaseAdmin
    .from("user_profiles")
    .select("role")
    .eq("user_id", userData.user.id)
    .single();

  if (profileErr || !profile) {
    return { error: "Profile not found", status: 403 } as const;
  }

  if (profile.role !== "ADMIN" && profile.role !== "SUPER_ADMIN") {
    return { error: "Forbidden", status: 403 } as const;
  }

  return { user: userData.user } as const;
}

export async function POST(req: Request) {
  const auth = await requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await req.json();
  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");
  const role = String(body.role ?? "USER");

  if (!email || !password) {
    return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    return NextResponse.json({ error: error?.message ?? "Create failed" }, { status: 400 });
  }

  if (role && role !== "USER") {
    await supabaseAdmin
      .from("user_profiles")
      .update({ role })
      .eq("user_id", data.user.id);
  }

  return NextResponse.json({ user_id: data.user.id }, { status: 201 });
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await req.json();
  const userId = String(body.user_id ?? "").trim();
  const role = String(body.role ?? "").trim();
  if (!userId || !role) {
    return NextResponse.json({ error: "Missing user_id or role" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("user_profiles")
    .update({ role })
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const auth = await requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await req.json();
  const userId = String(body.user_id ?? "").trim();
  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
