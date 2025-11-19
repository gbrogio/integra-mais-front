"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { api } from "@/lib/api"
import Link from "next/link"

export default function EditarAlunoPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [planos, setPlanos] = useState<any[]>([])
  const [formData, setFormData] = useState({
    nome: "",
    altura_cm: "",
    idade: "",
    restricoes: "",
    data_inicio_treino: "",
    frequencia_semana: "",
    plano_id: "",
    forma_pagamento: "",
    data_pagamento: "",
    observacoes: "",
  })

  useEffect(() => {
    if (params.id === "novo" || params.id === "editar") {
      return
    }
    loadAluno()
    loadPlanos()
  }, [params.id])

  async function loadPlanos() {
    try {
      const data = await api.getPlanos()
      setPlanos(data)
    } catch (error) {
      console.error("Erro ao carregar planos:", error)
    }
  }

  async function loadAluno() {
    if (params.id === "novo" || params.id === "editar") {
      return
    }

    try {
      const data = await api.getAluno(params.id as string)
      setFormData({
        nome: data.nome,
        altura_cm: data.altura_cm ? String(data.altura_cm) : "",
        idade: data.idade ? String(data.idade) : "",
        restricoes: data.restricoes || "",
        data_inicio_treino: data.data_inicio_treino || "",
        frequencia_semana: data.frequencia_semana ? String(data.frequencia_semana) : "",
        plano_id: data.plano_id || "",
        forma_pagamento: data.forma_pagamento || "",
        data_pagamento: data.data_pagamento || "",
        observacoes: data.observacoes || "",
      })
    } catch (error) {
      console.error("Erro ao carregar aluno:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await api.updateAluno(params.id as string, {
        ...formData,
        altura_cm: formData.altura_cm ? Number.parseFloat(formData.altura_cm) : undefined,
        idade: formData.idade ? Number.parseInt(formData.idade) : undefined,
        frequencia_semana: formData.frequencia_semana ? Number.parseInt(formData.frequencia_semana) : undefined,
      })
      router.push(`/dashboard/alunos/${params.id}`)
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error)
      alert("Erro ao atualizar aluno")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/alunos/${params.id}`}>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Editar Aluno</h1>
          <p className="text-slate-400">Atualize as informações do aluno</p>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Informações do Aluno</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-slate-300">
                  Nome Completo *
                </Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="altura_cm" className="text-slate-300">
                  Altura (cm)
                </Label>
                <Input
                  id="altura_cm"
                  name="altura_cm"
                  type="number"
                  value={formData.altura_cm}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idade" className="text-slate-300">
                  Idade
                </Label>
                <Input
                  id="idade"
                  name="idade"
                  type="number"
                  value={formData.idade}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_inicio_treino" className="text-slate-300">
                  Início do Treino
                </Label>
                <Input
                  id="data_inicio_treino"
                  name="data_inicio_treino"
                  type="date"
                  value={formData.data_inicio_treino}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequencia_semana" className="text-slate-300">
                  Frequência por semana
                </Label>
                <Input
                  id="frequencia_semana"
                  name="frequencia_semana"
                  type="number"
                  value={formData.frequencia_semana}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="plano_id" className="text-slate-300">
                  Plano
                </Label>
                <select
                  id="plano_id"
                  name="plano_id"
                  value={formData.plano_id}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border-slate-700 text-white rounded-md px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um plano (opcional)</option>
                  {planos.map((plano) => (
                    <option key={plano.id} value={plano.id}>
                      {plano.nome} - R$ {Number(plano.preco).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="forma_pagamento" className="text-slate-300">
                  Forma de pagamento
                </Label>
                <select
                  id="forma_pagamento"
                  name="forma_pagamento"
                  value={formData.forma_pagamento}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border-slate-700 text-white rounded-md px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="pix">Pix</option>
                  <option value="credito">Crédito</option>
                  <option value="debito">Débito</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_pagamento" className="text-slate-300">
                  Data de pagamento
                </Label>
                <Input
                  id="data_pagamento"
                  name="data_pagamento"
                  type="date"
                  value={formData.data_pagamento}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="restricoes" className="text-slate-300">
                  Restrições
                </Label>
                <Input
                  id="restricoes"
                  name="restricoes"
                  value={formData.restricoes}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="observacoes" className="text-slate-300">
                  Observações
                </Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows={4}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
              <Link href={`/dashboard/alunos/${params.id}`}>
                <Button type="button" variant="ghost" className="text-slate-400 hover:text-white">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
