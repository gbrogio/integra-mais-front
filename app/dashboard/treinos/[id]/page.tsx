"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Dumbbell } from "lucide-react"
import { api } from "@/lib/api"
import Link from "next/link"

interface Treino {
  id: string
  nome: string
  aluno_id: string
  descricao: string
  data_criacao: string
}

interface Exercicio {
  id: string
  nome: string
  series: number
  repeticoes: string
  tempo_descanso_seg?: number
  observacoes: string
}

export default function TreinoDetalhesPage() {
  const params = useParams()
  const [treino, setTreino] = useState<Treino | null>(null)
  const [exercicios, setExercicios] = useState<Exercicio[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddExercicio, setShowAddExercicio] = useState(false)
  const [novoExercicio, setNovoExercicio] = useState({
    nome: "",
    series: "",
    repeticoes: "",
    tempo_descanso_seg: "",
    observacoes: "",
  })

  console.log("[v0] TreinoDetalhesPage renderizando com id:", params.id)

  useEffect(() => {
    if (params.id === "novo") {
      console.log("[v0] ID é 'novo', não carregando dados")
      setLoading(false)
      return
    }
    loadTreino()
  }, [params.id])

  async function loadTreino() {
    if (params.id === "novo") {
      return
    }

    try {
      console.log("[v0] Carregando dados do treino:", params.id)
      const [treinoData, exerciciosData] = await Promise.all([
        api.getTreino(params.id as string),
        api.getExercicios(params.id as string),
      ])
      console.log("[v0] Dados carregados:", { treinoData, exerciciosData })
      setTreino(treinoData)
      setExercicios(exerciciosData)
    } catch (error) {
      console.error("[v0] Erro ao carregar treino:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddExercicio(e: React.FormEvent) {
    e.preventDefault()
    try {
      const exercicio = await api.addExercicio(params.id as string, {
        ...novoExercicio,
        series: Number.parseInt(novoExercicio.series),
        tempo_descanso_seg: novoExercicio.tempo_descanso_seg
          ? Number.parseInt(String(novoExercicio.tempo_descanso_seg))
          : undefined,
      })
      setExercicios([...exercicios, exercicio])
      setNovoExercicio({ nome: "", series: "", repeticoes: "", tempo_descanso_seg: "", observacoes: "" })
      setShowAddExercicio(false)
    } catch (error) {
      console.error("Erro ao adicionar exercício:", error)
      alert("Erro ao adicionar exercício")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Carregando...</div>
      </div>
    )
  }

  if (!treino && params.id !== "novo") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Treino não encontrado</div>
      </div>
    )
  }

  if (params.id === "novo") {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/treinos">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{treino.nome}</h1>
            <p className="text-slate-400">{treino.descricao}</p>
          </div>
        </div>
        <Button
          onClick={() => setShowAddExercicio(!showAddExercicio)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Exercício
        </Button>
      </div>

      {showAddExercicio && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Novo Exercício</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddExercicio} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-slate-300">
                    Nome do Exercício *
                  </Label>
                  <Input
                    id="nome"
                    value={novoExercicio.nome}
                    onChange={(e) => setNovoExercicio({ ...novoExercicio, nome: e.target.value })}
                    required
                    placeholder="Ex: Supino Reto"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="series" className="text-slate-300">
                    Séries *
                  </Label>
                  <Input
                    id="series"
                    type="number"
                    value={novoExercicio.series}
                    onChange={(e) => setNovoExercicio({ ...novoExercicio, series: e.target.value })}
                    required
                    placeholder="4"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repeticoes" className="text-slate-300">
                    Repetições *
                  </Label>
                  <Input
                    id="repeticoes"
                    value={novoExercicio.repeticoes}
                    onChange={(e) => setNovoExercicio({ ...novoExercicio, repeticoes: e.target.value })}
                    required
                    placeholder="8-12"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

              <div className="space-y-2">
                <Label htmlFor="tempo_descanso_seg" className="text-slate-300">
                  Tempo de descanso (seg)
                </Label>
                <Input
                  id="tempo_descanso_seg"
                  type="number"
                  value={String(novoExercicio.tempo_descanso_seg)}
                  onChange={(e) => setNovoExercicio({ ...novoExercicio, tempo_descanso_seg: e.target.value })}
                  placeholder="60"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="observacoes" className="text-slate-300">
                    Observações
                  </Label>
                  <Input
                    id="observacoes"
                    value={novoExercicio.observacoes}
                    onChange={(e) => setNovoExercicio({ ...novoExercicio, observacoes: e.target.value })}
                    placeholder="Técnica, descanso, etc..."
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Adicionar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAddExercicio(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Exercícios</CardTitle>
        </CardHeader>
        <CardContent>
          {exercicios.length === 0 ? (
            <div className="text-center py-12">
              <Dumbbell className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">Nenhum exercício adicionado ainda</p>
              <p className="text-sm text-slate-500">Clique em "Adicionar Exercício" para começar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {exercicios.map((exercicio, index) => (
                <div key={exercicio.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-semibold">
                          {index + 1}
                        </span>
                        <h3 className="text-white font-medium text-lg">{exercicio.nome}</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-4 ml-11">
                        <div>
                          <p className="text-xs text-slate-400">Séries</p>
                          <p className="text-white font-medium">{exercicio.series}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Repetições</p>
                          <p className="text-white font-medium">{exercicio.repeticoes}</p>
                        </div>
                      {exercicio.tempo_descanso_seg !== undefined && (
                        <div>
                          <p className="text-xs text-slate-400">Descanso</p>
                          <p className="text-white font-medium">{exercicio.tempo_descanso_seg}s</p>
                        </div>
                      )}
                      </div>
                      {exercicio.observacoes && (
                        <p className="text-sm text-slate-400 mt-2 ml-11">{exercicio.observacoes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
