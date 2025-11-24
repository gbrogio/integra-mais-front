import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md px-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">GestorFit</h1>
          <p className="text-slate-400">Crie sua conta de Personal Trainer</p>
        </div>
        <RegisterForm />
        <p className="text-center text-slate-400 mt-6">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
