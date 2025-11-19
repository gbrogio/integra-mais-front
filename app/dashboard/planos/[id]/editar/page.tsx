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

export default function EditarPlanoPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    duracao_meses: "",
  })

  useEffect(() => {
    loadPlano()
  }, [])

  async function loadPlano() {
    try {
      const data = await api.getPlano(params.id as string)
      setFormData({
        nome: data.nome,
        descricao: data.descricao,
        preco: String(data.preco),
        duracao_meses: String(data.duracao_meses),
      })
    } catch (error) {
      console.error("Erro ao carregar plano:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await api.updatePlano(params.id as string, {
        ...formData,
        preco: Number.parseFloat(formData.preco),
        duracao_meses: Number.parseInt(formData.duracao_meses),
      })
      router.push("/dashboard/planos")
    } catch (error) {
      console.error("Erro ao atualizar plano:", error)
      alert("Erro ao atualizar plano")
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
        <Link href="/dashboard/planos">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Editar Plano</h1>
          <p className="text-slate-400">Atualize as informações do plano</p>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 max-w-2xl">
        <CardHeader>
          <CardTitle className="text-white">Informações do Plano</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-slate-300">
                Nome do Plano *
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
              <Label htmlFor="descricao" className="text-slate-300">
                Descrição *
              </Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                required
                rows={4}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
              <Label htmlFor="preco" className="text-slate-300">
                Preço (R$) *
                </Label>
                <Input
                id="preco"
                name="preco"
                  type="number"
                  step="0.01"
                value={formData.preco}
                  onChange={handleChange}
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
              <Label htmlFor="duracao_meses" className="text-slate-300">
                Duração (meses) *
                </Label>
                <Input
                id="duracao_meses"
                name="duracao_meses"
                  type="number"
                value={formData.duracao_meses}
                  onChange={handleChange}
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
              <Link href="/dashboard/planos">
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
