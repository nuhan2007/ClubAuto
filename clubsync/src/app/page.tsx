// app/page.tsx
"use client";
import LoginPage from "./login/page";

export default function Home() {
  return <LoginPage onLogin={() => {/* navigate to /dashboard */}} />;
}
