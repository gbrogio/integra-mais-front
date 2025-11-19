"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Calendar,
  Target,
  Weight,
  Ruler,
  Plus,
  TrendingDown,
  CreditCard,
  Dumbbell,
} from "lucide-react"
import { api } from "@/lib/api"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Aluno {
  id: string
  nome: string
  altura_cm?: number
  idade?: number
  restricoes?: string
  data_inicio_treino?: string
  frequencia_semana?: number
  plano_id?: string
  forma_pagamento?: string
  data_pagamento?: string
  observacoes?: string
}

interface HistoricoPeso {
  id: string
  peso_kg: number
  data: string
}

export default function AlunoDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const [aluno, setAluno] = useState<Aluno | null>(null)
  const [historico, setHistorico] = useState<HistoricoPeso[]>([])
  const [plano, setPlano] = useState<any>(null)
  const [treinos, setTreinos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddPeso, setShowAddPeso] = useState(false)
  const [novoPeso, setNovoPeso] = useState({
    peso_kg: "",
    data: new Date().toISOString().split("T")[0],
  })

  console.log("[v0] AlunoDetalhesPage renderizando com id:", params.id)

  useEffect(() => {
    if (params.id === "novo" || params.id === "editar") {
      console.log("[v0] ID é 'novo' ou 'editar', não carregando dados")
      setLoading(false)
      return
    }
    loadAluno()
  }, [params.id])

  async function loadAluno() {
    if (params.id === "novo" || params.id === "editar") {
      return
    }

    try {
      console.log("[v0] Carregando dados do aluno:", params.id)
      const [alunoData, historicoData, treinosData] = await Promise.all([
        api.getAluno(params.id as string),
        api.getHistoricoPeso(params.id as string),
        api.getTreinos(params.id as string),
      ])
      console.log("[v0] Dados carregados:", { alunoData, historicoData, treinosData })
      setAluno(alunoData)
      setHistorico(historicoData)
      setTreinos(treinosData)

      if (alunoData.plano_id) {
        const planoData = await api.getPlano(alunoData.plano_id)
        setPlano(planoData)
      }
    } catch (error) {
      console.error("[v0] Erro ao carregar aluno:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddPeso(e: React.FormEvent) {
    e.preventDefault()
    try {
      await api.addHistoricoPeso(params.id as string, novoPeso)
      await loadAluno()
      setNovoPeso({ peso_kg: "", data: new Date().toISOString().split("T")[0] })
      setShowAddPeso(false)
    } catch (error) {
      console.error("Erro ao adicionar peso:", error)
      alert("Erro ao adicionar peso")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Carregando...</div>
      </div>
    )
  }

  if (!aluno && params.id !== "novo" && params.id !== "editar") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Aluno não encontrado</div>
      </div>
    )
  }

  if (params.id === "novo" || params.id === "editar") {
    return null
  }

  
  if (!aluno) {
    return null
  }

  const chartData = historico
    .map((h) => ({
      data: new Date(h.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      peso: Number(h.peso_kg),
    }))
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())

  const pesoInicial = historico.length > 0 ? historico[0].peso_kg : undefined
  const pesoAtual = historico.length > 0 ? historico[historico.length - 1].peso_kg : undefined
  const pesoInicialNum = pesoInicial !== undefined ? Number(pesoInicial) : undefined
  const pesoAtualNum = pesoAtual !== undefined ? Number(pesoAtual) : undefined
  const diferencaPeso =
    pesoInicialNum !== undefined && pesoAtualNum !== undefined ? pesoAtualNum - pesoInicialNum : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/alunos">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{aluno.nome}</h1>
            <p className="text-slate-400">Detalhes do aluno</p>
          </div>
        </div>
        <Link href={`/dashboard/alunos/${aluno.id}/editar`}>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Início do Treino</p>
                <p className="text-white">
                  {aluno.data_inicio_treino
                    ? new Date(aluno.data_inicio_treino).toLocaleDateString("pt-BR")
                    : "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Idade</p>
                <p className="text-white">{typeof aluno.idade === "number" ? aluno.idade : "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Restrições</p>
                <p className="text-white">{aluno.restricoes || "Nenhuma"}</p>
              </div>
            </div>
            {aluno.observacoes && (
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Observações</p>
                  <p className="text-white">{aluno.observacoes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Medidas</CardTitle>
            </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Ruler className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-xs text-slate-400">Altura</p>
                <p className="text-2xl font-bold text-white">
                  {typeof aluno.altura_cm === "number" ? `${aluno.altura_cm} cm` : "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-xs text-slate-400">Frequência Semanal</p>
                <p className="text-2xl font-bold text-white">
                  {typeof aluno.frequencia_semana === "number" ? `${aluno.frequencia_semana}x` : "—"}
                </p>
              </div>
            </div>
          </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Plano Atual
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {plano ? (
              <div className="space-y-3">
                <div>
                  <p className="text-lg font-semibold text-white">{plano.nome}</p>
                  <p className="text-sm text-slate-400">{plano.descricao}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                  <span className="text-slate-400">Valor</span>
                  <span className="text-xl font-bold text-green-400">R$ {Number(plano.preco).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Duração</span>
                  <span className="text-white">{plano.duracao_meses} meses</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 mb-2">Nenhum plano atribuído</p>
                <Link href={`/dashboard/alunos/${aluno.id}/editar`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:text-white bg-transparent"
                  >
                    Atribuir Plano
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Treinos
              </CardTitle>
              <Link href={`/dashboard/treinos/novo?aluno_id=${aluno.id}`}>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-1" />
                  Novo Treino
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {treinos.length > 0 ? (
              <div className="space-y-2">
                {treinos.map((treino) => (
                  <Link key={treino.id} href={`/dashboard/treinos/${treino.id}`}>
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer">
                      <p className="font-medium text-white">{treino.nome}</p>
                      <p className="text-xs text-slate-400 mt-1">{treino.descricao}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Dumbbell className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 mb-2">Nenhum treino criado</p>
                <Link href={`/dashboard/treinos/novo?aluno_id=${aluno.id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:text-white bg-transparent"
                  >
                    Criar Primeiro Treino
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Histórico de Peso</CardTitle>
            <Button
              onClick={() => setShowAddPeso(!showAddPeso)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Peso
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {showAddPeso && (
            <form onSubmit={handleAddPeso} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="peso_kg" className="text-slate-300">
                    Peso (kg) *
                  </Label>
                  <Input
                  id="peso_kg"
                    type="number"
                    step="0.1"
                  value={novoPeso.peso_kg}
                  onChange={(e) => setNovoPeso({ ...novoPeso, peso_kg: e.target.value })}
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data" className="text-slate-300">
                    Data *
                  </Label>
                  <Input
                    id="data"
                    type="date"
                    value={novoPeso.data}
                    onChange={(e) => setNovoPeso({ ...novoPeso, data: e.target.value })}
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Salvar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAddPeso(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          {historico.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <p className="text-xs text-slate-400 mb-1">Peso Inicial</p>
                  <p className="text-2xl font-bold text-white">
                    {pesoInicialNum !== undefined ? `${pesoInicialNum.toFixed(1)} kg` : "—"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <p className="text-xs text-slate-400 mb-1">Peso Atual</p>
                  <p className="text-2xl font-bold text-white">
                    {pesoAtualNum !== undefined ? `${pesoAtualNum.toFixed(1)} kg` : "—"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <p className="text-xs text-slate-400 mb-1">Diferença</p>
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-2xl font-bold ${diferencaPeso < 0 ? "text-green-400" : diferencaPeso > 0 ? "text-red-400" : "text-white"}`}
                    >
                      {diferencaPeso > 0 ? "+" : ""}
                      {diferencaPeso.toFixed(1)} kg
                    </p>
                    {diferencaPeso < 0 && <TrendingDown className="h-5 w-5 text-green-400" />}
                  </div>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="data" stroke="#94a3b8" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} domain={["dataMin - 2", "dataMax + 2"]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      labelStyle={{ color: "#94a3b8" }}
                    />
                    <Line type="monotone" dataKey="peso" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-300">Registros</h3>
                <div className="space-y-2">
                  {historico
                    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                    .map((h) => (
                      <div
                        key={h.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50"
                      >
                        <span className="text-slate-400 text-sm">
                          {new Date(h.data).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-white font-medium">{h.peso_kg} kg</span>
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Weight className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">Nenhum registro de peso ainda</p>
              <p className="text-sm text-slate-500">Adicione o primeiro registro para começar o acompanhamento</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
