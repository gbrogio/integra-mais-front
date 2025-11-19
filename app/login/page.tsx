import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md px-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Integra Mais</h1>
          <p className="text-slate-400">Sistema de Gestão para Personal Trainers</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
