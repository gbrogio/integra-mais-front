"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { DollarSign, Dumbbell, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalAlunos: 0,
    totalTreinos: 0,
    receitaMensal: 0,
  });
  const [loading, setLoading] = useState(true);
  const [upcomingDues, setUpcomingDues] = useState<any[]>([]);
  const [recentTreinos, setRecentTreinos] = useState<any[]>([]);

  useEffect(() => {
    async function loadStats() {
      try {
        const [alunos, treinos, planos] = await Promise.all([
          api.getAlunos(),
          api.getTreinos(),
          api.getPlanos(),
        ]);
        const pagamentosLists = await Promise.all(
          alunos.map((a: any) => api.getPagamentos(a.id))
        );
        const receitaMensal = pagamentosLists
          .flat()
          .reduce((sum: number, p: any) => sum + (p.valor || 0), 0);

        setStats({
          totalAlunos: alunos.length,
          totalTreinos: treinos.length,
          receitaMensal,
        });

        // Mapear planos por id para obter nome e preço
        const planoPorId = new Map<string, any>();
        for (const p of planos || []) {
          if (p && p.id) planoPorId.set(p.id, p);
        }

        // Próximos vencimentos a partir de alunos + plano_data_vencimento
        const hoje = new Date();
        const proximos = (alunos || [])
          .map((aluno: any) => {
            const venc = aluno?.plano_data_vencimento
              ? new Date(aluno.plano_data_vencimento)
              : null;
            if (!venc || isNaN(venc.getTime())) return null;
            const diffMs =
              venc.getTime() - new Date(hoje.toDateString()).getTime();
            const dias = Math.round(diffMs / (1000 * 60 * 60 * 24));
            const plano = aluno?.plano_id
              ? planoPorId.get(aluno.plano_id)
              : null;
            return {
              alunoNome: aluno?.nome || "—",
              planoNome: plano?.nome || "—",
              preco: typeof plano?.preco === "number" ? plano.preco : null,
              diasRestantes: dias,
              dataVencimento: venc,
            };
          })
          .filter(Boolean)
          .sort((a: any, b: any) => a.diasRestantes - b.diasRestantes)
          .slice(0, 5);

        setUpcomingDues(proximos as any[]);

        // Treinos recentes (ordenar por created_at/updated_at quando disponível)
        const treinoComData = (treinos || []).map((t: any) => {
          const created =
            t && (t.created_at || t.data_criacao || t.createdAt)
              ? new Date(t.created_at || t.data_criacao || t.createdAt)
              : null;
          const updated =
            t && (t.updated_at || t.data_atualizacao || t.updatedAt)
              ? new Date(t.updated_at || t.data_atualizacao || t.updatedAt)
              : null;
          const refDate =
            updated && !isNaN(updated.getTime())
              ? updated
              : created && !isNaN(created.getTime())
              ? created
              : null;
          return {
            ...t,
            _refDate: refDate,
          };
        });

        const recentes = treinoComData
          .sort((a: any, b: any) => {
            const at = a._refDate ? a._refDate.getTime() : 0;
            const bt = b._refDate ? b._refDate.getTime() : 0;
            return bt - at;
          })
          .slice(0, 5);

        setRecentTreinos(recentes);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

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
  ];

  function formatDiasRestantes(dias: number) {
    if (dias === 0) return "Vence hoje";
    if (dias === 1) return "Vence em 1 dia";
    if (dias > 1) return `Vence em ${dias} dias`;
    if (dias === -1) return "Vencido há 1 dia";
    return `Vencido há ${Math.abs(dias)} dias`;
  }

  function formatPreco(preco: number | null | undefined) {
    if (typeof preco !== "number") return "—";
    return `R$ ${preco.toFixed(2)}`;
  }

  function formatDataRelativa(date: Date | null) {
    if (!date || isNaN(date.getTime())) return "—";
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    if (diffMin < 1) return "agora";
    if (diffMin < 60) return `há ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `há ${diffH} h`;
    const diffD = Math.floor(diffH / 24);
    return `há ${diffD} d`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Carregando...</div>
      </div>
    );
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
              <CardTitle className="text-sm font-medium text-slate-400">
                {stat.title}
              </CardTitle>
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
            <CardTitle className="text-white">Treinos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTreinos.length === 0 ? (
                <div className="text-slate-400 text-sm">
                  Nenhum treino recente
                </div>
              ) : (
                recentTreinos.map((t: any) => {
                  const refDate: Date | null =
                    t._refDate && !isNaN(t._refDate.getTime())
                      ? t._refDate
                      : null;
                  return (
                    <div key={t.id} className="flex items-center gap-4">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm text-white">
                          {t.nome || "Treino"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatDataRelativa(refDate)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Próximos Vencimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDues.length === 0 ? (
                <div className="text-slate-400 text-sm">
                  Nenhum vencimento próximo
                </div>
              ) : (
                upcomingDues.map((item: any, idx: number) => {
                  const isOverdue = item.diasRestantes < 0;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm text-white">{item.alunoNome}</p>
                        <p className="text-xs text-slate-400">
                          {item.planoNome}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white">
                          {formatPreco(item.preco)}
                        </p>
                        <p
                          className={`text-xs ${
                            isOverdue ? "text-red-400" : "text-orange-400"
                          }`}
                        >
                          {formatDiasRestantes(item.diasRestantes)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
