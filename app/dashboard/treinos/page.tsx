"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Eye, Calendar } from "lucide-react"
import { api } from "@/lib/api"
import Link from "next/link"

interface Treino {
  id: string
  nome: string
  aluno_id: string
  descricao: string
  data_criacao: string
}

interface Aluno {
  id: string
  nome: string
}

export default function TreinosPage() {
  const [treinos, setTreinos] = useState<Treino[]>([])
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [filteredTreinos, setFilteredTreinos] = useState<Treino[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const filtered = treinos.filter((treino) => treino.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredTreinos(filtered)
  }, [searchTerm, treinos])

  async function loadData() {
    try {
      const [treinosData, alunosData] = await Promise.all([api.getTreinos(), api.getAlunos()])
      setTreinos(treinosData)
      setFilteredTreinos(treinosData)
      setAlunos(alunosData)
    } catch (error) {
      console.error("Erro ao carregar treinos:", error)
    } finally {
      setLoading(false)
    }
  }

  function getAlunoNome(alunoId: string) {
    const aluno = alunos.find((a) => a.id === alunoId)
    return aluno?.nome || "Aluno não encontrado"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Carregando treinos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Treinos</h1>
          <p className="text-slate-400">Gerencie os treinos dos seus alunos</p>
        </div>
        <Link href="/dashboard/treinos/novo">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Novo Treino
          </Button>
        </Link>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar treino..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTreinos.length === 0 ? (
              <div className="col-span-full text-center py-8 text-slate-400">Nenhum treino encontrado</div>
            ) : (
              filteredTreinos.map((treino) => (
                <Link key={treino.id} href={`/dashboard/treinos/${treino.id}`}>
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-600 transition-colors cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{treino.nome}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-slate-400 line-clamp-2">{treino.descricao}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(treino.data_criacao).toLocaleDateString("pt-BR")}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                            {getAlunoNome(treino.aluno_id).charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs text-slate-400">{getAlunoNome(treino.aluno_id)}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="w-full text-blue-400 hover:text-blue-300">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
