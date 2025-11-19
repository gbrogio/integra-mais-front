"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { api } from "@/lib/api"
import Link from "next/link"

interface Aluno {
  id: string
  nome: string
  frequencia_semana?: number
  altura_cm?: number
}

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadAlunos()
  }, [])

  useEffect(() => {
    const filtered = alunos.filter((aluno) => aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredAlunos(filtered)
  }, [searchTerm, alunos])

  async function loadAlunos() {
    try {
      const data = await api.getAlunos()
      setAlunos(data)
      setFilteredAlunos(data)
    } catch (error) {
      console.error("Erro ao carregar alunos:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este aluno?")) return

    try {
      await api.deleteAluno(id)
      loadAlunos()
    } catch (error) {
      console.error("Erro ao excluir aluno:", error)
      alert("Erro ao excluir aluno")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Carregando alunos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Alunos</h1>
          <p className="text-slate-400">Gerencie seus alunos e acompanhe o progresso</p>
        </div>
        <Link href="/dashboard/alunos/novo">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Novo Aluno
          </Button>
        </Link>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlunos.length === 0 ? (
              <div className="text-center py-8 text-slate-400">Nenhum aluno encontrado</div>
            ) : (
              filteredAlunos.map((aluno) => (
                <div
                  key={aluno.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {aluno.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{aluno.nome}</h3>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        {typeof aluno.frequencia_semana === "number" && (
                          <span className="text-xs text-slate-500">Frequência: {aluno.frequencia_semana}/semana</span>
                        )}
                        {typeof aluno.altura_cm === "number" && (
                          <span className="text-xs text-slate-500">Altura: {aluno.altura_cm} cm</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/alunos/${aluno.id}`}>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/alunos/${aluno.id}/editar`}>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(aluno.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
