"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { api } from "@/lib/api"
import Link from "next/link"

interface Aluno {
  id: string
  nome: string
}

export default function NovoTreinoPage() {
  const router = useRouter()
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    aluno_id: "",
    descricao: "",
  })

  console.log("[v0] NovoTreinoPage renderizando")

  useEffect(() => {
    loadAlunos()
  }, [])

  async function loadAlunos() {
    try {
      console.log("[v0] Carregando alunos...")
      const data = await api.getAlunos()
      console.log("[v0] Alunos carregados:", data)
      setAlunos(data)
    } catch (error) {
      console.error("[v0] Erro ao carregar alunos:", error)
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
    setLoading(true)

    try {
      console.log("[v0] Criando treino com dados:", formData)
      const treino = await api.createTreino(formData)
      console.log("[v0] Treino criado com sucesso:", treino)
      router.push(`/dashboard/treinos/${treino.id}`)
    } catch (error) {
      console.error("[v0] Erro ao criar treino:", error)
      alert("Erro ao criar treino")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/treinos">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Novo Treino</h1>
          <p className="text-slate-400">Crie um novo treino para seu aluno</p>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Informações do Treino</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-slate-300">
                Nome do Treino *
              </Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                placeholder="Ex: Treino A - Peito e Tríceps"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aluno_id" className="text-slate-300">
                Aluno *
              </Label>
              <Select
                value={formData.aluno_id}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, aluno_id: value }))}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Selecione um aluno" />
                </SelectTrigger>
                <SelectContent>
                  {alunos.map((aluno) => (
                    <SelectItem key={aluno.id} value={aluno.id}>
                      {aluno.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-slate-300">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={4}
                placeholder="Descreva o objetivo e foco deste treino..."
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? "Criando..." : "Criar Treino"}
              </Button>
              <Link href="/dashboard/treinos">
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
