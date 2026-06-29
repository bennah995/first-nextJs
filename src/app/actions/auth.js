// app/actions/auth.js
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "@/lib/db";

export async function loginAction(prevState, formData) {
  const email = formData.get("email")?.toString().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email and password required" };
  }

  const { rows } = await query(
    "SELECT id, email, role, password_hash FROM users WHERE email = $1",
    [email]
  );
  const user = rows[0];
  if (!user) {
    return { error: "Invalid credentials" };
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return { error: "Invalid credentials" };
  }

  if (user.role !== "admin") {
    return { error: "Not an admin" };
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  cookies().set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect("/admin/orders");
}

export async function logoutAction() {
  cookies().delete("admin_token");
  redirect("/admin/login");
}

export async function requireAdmin() {
  const token = cookies().get("admin_token")?.value;
  if (!token) redirect("/admin/login");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "admin") redirect("/admin/login");
    return payload;
  } catch {
    redirect("/admin/login");
  }
}