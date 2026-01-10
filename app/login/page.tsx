"use client";

import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <LoginForm
        onSuccess={() => (window.location.href = "/")}
        onGuest={() => (window.location.href = "/")}
      />
    </div>
  );
}
