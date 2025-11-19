"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Dumbbell, DollarSign } from "lucide-react"
import { api } from "@/lib/api"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalAlunos: 0,
    totalTreinos: 0,
    receitaMensal: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [alunos, treinos] = await Promise.all([api.getAlunos(), api.getTreinos()])
        const pagamentosLists = await Promise.all(alunos.map((a: any) => api.getPagamentos(a.id)))
        const receitaMensal = pagamentosLists.flat().reduce((sum: number, p: any) => sum + (p.valor || 0), 0)

        setStats({
          totalAlunos: alunos.length,
          totalTreinos: treinos.length,
          receitaMensal,
        })
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const statCards = [
    {
      title: "Total de Alunos",
      value: stats.totalAlunos,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Treinos Criados",
      value: stats.totalTreinos,
      icon: Dumbbell,
      color: "text-purple-500",
    },
    {
      title: "Receita Mensal",
      value: `R$ ${stats.receitaMensal.toFixed(2)}`,
      icon: DollarSign,
      color: "text-yellow-500",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Visão geral do seu negócio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-slate-900/50 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm text-white">Novo aluno cadastrado</p>
                  <p className="text-xs text-slate-400">João Silva - há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm text-white">Treino criado</p>
                  <p className="text-xs text-slate-400">Treino A - Peito e Tríceps - há 5 horas</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <div className="flex-1">
                  <p className="text-sm text-white">Pagamento recebido</p>
                  <p className="text-xs text-slate-400">Maria Santos - R$ 149,90 - há 1 dia</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Próximos Vencimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">João Silva</p>
                  <p className="text-xs text-slate-400">Plano Premium</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">R$ 299,90</p>
                  <p className="text-xs text-orange-400">Vence em 5 dias</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Maria Santos</p>
                  <p className="text-xs text-slate-400">Plano Básico</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">R$ 149,90</p>
                  <p className="text-xs text-orange-400">Vence em 8 dias</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
