export const mockData = {
  user: {
    id: "1",
    nome: "Personal Trainer Demo",
    email: "demo@integramais.com",
  },
  alunos: [
    {
      id: "1",
      nome: "João Silva",
      altura_cm: 175,
      idade: 30,
      restricoes: "Nenhuma",
      data_inicio_treino: "2025-01-01",
      frequencia_semana: 3,
      plano_id: "1",
      plano_data_inicio: "2025-01-10",
      plano_data_vencimento: "2025-02-10",
      forma_pagamento: "pix",
      data_pagamento: "2025-01-10",
      observacoes: "Aluno novo",
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-15T00:00:00Z",
    },
    {
      id: "2",
      nome: "Maria Santos",
      altura_cm: 165,
      idade: 35,
      restricoes: "",
      data_inicio_treino: "2025-01-05",
      frequencia_semana: 4,
      plano_id: "2",
      plano_data_inicio: "2025-01-12",
      plano_data_vencimento: "2025-02-12",
      forma_pagamento: "credito",
      data_pagamento: "2025-01-12",
      observacoes: "",
      created_at: "2025-01-05T00:00:00Z",
      updated_at: "2025-01-20T00:00:00Z",
    },
    {
      id: "3",
      nome: "Pedro Costa",
      altura_cm: 180,
      idade: 37,
      restricoes: "Joelho direito",
      data_inicio_treino: "2025-01-08",
      frequencia_semana: 2,
      plano_id: "1",
      plano_data_inicio: "2025-01-10",
      plano_data_vencimento: "2025-02-10",
      forma_pagamento: "debito",
      data_pagamento: "2025-01-10",
      observacoes: "",
      created_at: "2025-01-08T00:00:00Z",
      updated_at: "2025-01-18T00:00:00Z",
    },
  ],
  planos: [
    {
      id: "1",
      nome: "Plano Premium",
      descricao: "Treino personalizado + acompanhamento nutricional",
      preco: 299.9,
      duracao_meses: 1,
    },
    {
      id: "2",
      nome: "Plano Básico",
      descricao: "Treino personalizado",
      preco: 149.9,
      duracao_meses: 1,
    },
  ],
  treinos: [
    {
      id: "1",
      nome: "Treino A - Peito e Tríceps",
      aluno_id: "1",
      descricao: "Foco em hipertrofia",
      data_criacao: "2025-01-15",
    },
    {
      id: "2",
      nome: "Treino B - Costas e Bíceps",
      aluno_id: "1",
      descricao: "Foco em hipertrofia",
      data_criacao: "2025-01-15",
    },
  ],
  pagamentos: [
    {
      id: "1",
      aluno_id: "1",
      valor: 299.9,
      forma_pagamento: "pix",
      data_pagamento: "2025-01-10",
      status: "pago",
      transacao_id: "tx_0001",
    },
    {
      id: "2",
      aluno_id: "2",
      valor: 149.9,
      forma_pagamento: "credito",
      data_pagamento: "2025-01-12",
      status: "pago",
      transacao_id: "tx_0002",
    },
  ],
  historicoPeso: [
    {
      id: "1",
      aluno_id: "1",
      data: "2025-01-01",
      peso_kg: 80.0,
      percentual_gordura: 18.0,
      observacao: "Início do programa",
    },
    {
      id: "2",
      aluno_id: "1",
      data: "2025-01-08",
      peso_kg: 79.2,
      percentual_gordura: 17.5,
      observacao: "Boa evolução",
    },
    {
      id: "3",
      aluno_id: "1",
      data: "2025-01-15",
      peso_kg: 78.5,
      percentual_gordura: 17.2,
      observacao: "",
    },
  ],
}

// Simula delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const apiMock = {
  // Auth
  login: async (email: string, password: string) => {
    await delay(500)
    if (email === "demo@integramais.com" && password === "demo123") {
      return { access_token: "mock-token-123", token_type: "bearer" }
    }
    throw new Error("Credenciais inválidas")
  },

  register: async (nome: string, email: string, password: string) => {
    await delay(500)
    return { id: "new-user", nome, email }
  },

  // Alunos
  getAlunos: async () => {
    await delay(300)
    return mockData.alunos
  },

  getAluno: async (id: string) => {
    await delay(300)
    const aluno = mockData.alunos.find((a) => a.id === id)
    if (!aluno) throw new Error("Aluno não encontrado")
    return aluno
  },

  createAluno: async (data: any) => {
    await delay(500)
    const newAluno = { id: String(mockData.alunos.length + 1), ...data }
    mockData.alunos.push(newAluno)
    return newAluno
  },

  updateAluno: async (id: string, data: any) => {
    await delay(500)
    const index = mockData.alunos.findIndex((a) => a.id === id)
    if (index === -1) throw new Error("Aluno não encontrado")
    mockData.alunos[index] = { ...mockData.alunos[index], ...data }
    return mockData.alunos[index]
  },

  deleteAluno: async (id: string) => {
    await delay(500)
    const index = mockData.alunos.findIndex((a) => a.id === id)
    if (index === -1) throw new Error("Aluno não encontrado")
    mockData.alunos.splice(index, 1)
    return { message: "Aluno removido com sucesso" }
  },

  // Histórico de Peso
  getHistoricoPeso: async (alunoId: string) => {
    await delay(300)
    return mockData.historicoPeso.filter((h) => h.aluno_id === alunoId)
  },

  addHistoricoPeso: async (alunoId: string, data: any) => {
    await delay(500)
    const newHistorico = {
      id: String(mockData.historicoPeso.length + 1),
      aluno_id: alunoId,
      ...data,
    }
    mockData.historicoPeso.push(newHistorico)
    return newHistorico
  },

  // Planos
  getPlanos: async () => {
    await delay(300)
    return mockData.planos
  },

  getPlano: async (id: string) => {
    await delay(300)
    const plano = mockData.planos.find((p) => p.id === id)
    if (!plano) throw new Error("Plano não encontrado")
    return plano
  },

  createPlano: async (data: any) => {
    await delay(500)
    const newPlano = { id: String(mockData.planos.length + 1), ...data }
    mockData.planos.push(newPlano)
    return newPlano
  },

  updatePlano: async (id: string, data: any) => {
    await delay(500)
    const index = mockData.planos.findIndex((p) => p.id === id)
    if (index === -1) throw new Error("Plano não encontrado")
    mockData.planos[index] = { ...mockData.planos[index], ...data }
    return mockData.planos[index]
  },

  deletePlano: async (id: string) => {
    await delay(500)
    const index = mockData.planos.findIndex((p) => p.id === id)
    if (index === -1) throw new Error("Plano não encontrado")
    mockData.planos.splice(index, 1)
    return { message: "Plano removido com sucesso" }
  },

  // Pagamentos
  getPagamentos: async (alunoId: string) => {
    await delay(300)
    return mockData.pagamentos.filter((p) => p.aluno_id === alunoId)
  },

  addPagamento: async (alunoId: string, data: any) => {
    await delay(500)
    const newPagamento = {
      id: String(mockData.pagamentos.length + 1),
      aluno_id: alunoId,
      ...data,
    }
    mockData.pagamentos.push(newPagamento)
    return newPagamento
  },

  // Treinos
  getTreinos: async (alunoId?: string) => {
    await delay(300)
    if (alunoId) {
      return mockData.treinos.filter((t) => t.aluno_id === alunoId)
    }
    return mockData.treinos
  },

  getTreino: async (id: string) => {
    await delay(300)
    const treino = mockData.treinos.find((t) => t.id === id)
    if (!treino) throw new Error("Treino não encontrado")
    return treino
  },

  createTreino: async (data: any) => {
    await delay(500)
    const newTreino = {
      id: String(mockData.treinos.length + 1),
      ...data,
      data_criacao: new Date().toISOString().split("T")[0],
    }
    mockData.treinos.push(newTreino)
    return newTreino
  },

  // Exercícios
  getExercicios: async (treinoId: string) => {
    await delay(300)
    return [
      {
        id: "1",
        treino_id: treinoId,
        nome: "Supino Reto",
        series: 4,
        repeticoes: "8-12",
        tempo_descanso_seg: 90,
        observacoes: "Descanso de 90 segundos entre séries",
      },
      {
        id: "2",
        treino_id: treinoId,
        nome: "Supino Inclinado",
        series: 3,
        repeticoes: "10-12",
        tempo_descanso_seg: 60,
        observacoes: "Foco na parte superior do peitoral",
      },
      {
        id: "3",
        treino_id: treinoId,
        nome: "Tríceps Testa",
        series: 3,
        repeticoes: "12-15",
        tempo_descanso_seg: 60,
        observacoes: "Manter cotovelos fixos",
      },
    ]
  },

  addExercicio: async (treinoId: string, data: any) => {
    await delay(500)
    return { id: String(Date.now()), treino_id: treinoId, ...data }
  },

  // Progressão
  setRegraProgressao: async (alunoId: string, exercicioId: string, data: any) => {
    await delay(500)
    return { message: "Regra de progressão definida com sucesso" }
  },
}
