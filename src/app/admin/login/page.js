// app/admin/login/page.js
import LoginForm from "./LoginForm";
export const metadata = { title: "Admin Login" };
export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto p-16">
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
      <LoginForm />
    </div>
  );
}