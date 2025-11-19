const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true"

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    throw new Error("Não autorizado")
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Erro desconhecido" }))
    throw new Error(error.detail || "Erro na requisição")
  }

  return response.json()
}

export const api = {
  // Auth
  authLogin: (username: string, password: string) =>
    apiRequest("/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ username, password }).toString(),
    }),
  authRegister: (nome: string, email: string, password: string) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ nome, email, password }),
    }),
  // Alunos
  getAlunos: () => apiRequest("/api/alunos"),
  getAluno: (id: string) => apiRequest(`/api/alunos/${id}`),
  createAluno: (data: any) =>
    apiRequest("/api/alunos", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateAluno: (id: string, data: any) =>
    apiRequest(`/api/alunos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteAluno: (id: string) =>
    apiRequest(`/api/alunos/${id}`, {
      method: "DELETE",
    }),

  // Histórico de Peso
  getHistoricoPeso: (alunoId: string) => apiRequest(`/api/alunos/${alunoId}/historico-peso`),
  addHistoricoPeso: (alunoId: string, data: any) =>
    apiRequest(`/api/alunos/${alunoId}/historico-peso`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Planos
  getPlanos: () => apiRequest("/api/planos"),
  getPlano: (id: string) => apiRequest(`/api/planos/${id}`),
  createPlano: (data: any) =>
    apiRequest("/api/planos", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updatePlano: (id: string, data: any) =>
    apiRequest(`/api/planos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deletePlano: (id: string) =>
    apiRequest(`/api/planos/${id}`, {
      method: "DELETE",
    }),

  // Pagamentos
  getPagamentos: (alunoId: string) => apiRequest(`/api/alunos/${alunoId}/pagamentos`),
  addPagamento: (alunoId: string, data: any) =>
    apiRequest(`/api/alunos/${alunoId}/pagamentos`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Treinos
  getTreinos: (alunoId?: string) => {
    const query = alunoId ? `?aluno_id=${alunoId}` : ""
    return apiRequest(`/api/treinos${query}`)
  },
  getTreino: (id: string) => apiRequest(`/api/treinos/${id}`),
  createTreino: (data: any) =>
    apiRequest("/api/treinos", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Exercícios
  getExercicios: (treinoId: string) => apiRequest(`/api/treinos/${treinoId}/exercicios`),
  addExercicio: (treinoId: string, data: any) =>
    apiRequest(`/api/treinos/${treinoId}/exercicios`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Progressão
  setRegraProgressao: (alunoId: string, exercicioId: string, data: any) =>
    apiRequest(`/api/alunos/${alunoId}/exercicios-plano/${exercicioId}/regra-progressao`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}
