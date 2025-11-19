"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, DollarSign, Calendar } from "lucide-react"
import { api } from "@/lib/api"
import Link from "next/link"

interface Plano {
  id: string
  nome: string
  descricao: string
  preco: number
  duracao_meses: number
}

export default function PlanosPage() {
  const [planos, setPlanos] = useState<Plano[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPlanos()
  }, [])

  async function loadPlanos() {
    try {
      const data = await api.getPlanos()
      setPlanos(data)
    } catch (error) {
      console.error("Erro ao carregar planos:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este plano?")) return

    try {
      await api.deletePlano(id)
      loadPlanos()
    } catch (error) {
      console.error("Erro ao excluir plano:", error)
      alert("Erro ao excluir plano")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Carregando planos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Planos</h1>
          <p className="text-slate-400">Gerencie os planos de treinamento</p>
        </div>
        <Link href="/dashboard/planos/novo">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Novo Plano
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planos.map((plano) => (
          <Card key={plano.id} className="bg-slate-900/50 border-slate-800 hover:border-blue-600 transition-colors">
            <CardHeader>
              <CardTitle className="text-white text-xl">{plano.nome}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-400 text-sm min-h-[40px]">{plano.descricao}</p>

              <div className="space-y-3 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">Valor</span>
                  </div>
                  <span className="text-2xl font-bold text-white">R$ {Number(plano.preco).toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Duração</span>
                  </div>
                  <span className="text-white font-medium">{plano.duracao_meses} meses</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <Link href={`/dashboard/planos/${plano.id}/editar`} className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-slate-700 text-slate-300 hover:text-white bg-transparent"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(plano.id)}
                  className="border-red-900 text-red-400 hover:bg-red-950 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {planos.length === 0 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="py-12 text-center">
            <DollarSign className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">Nenhum plano cadastrado</p>
            <p className="text-sm text-slate-500">Crie seu primeiro plano de treinamento</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
