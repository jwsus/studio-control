import type { ReactNode } from "react";

export type Aba = "painel" | "aulas" | "chamada" | "alunos" | "professores" | "historico" | "relatorios";
export type Perfil = "admin" | "professor";
export type Modalidade = "pilates" | "musculacao";
export type FormaPagamento = "credito" | "pix" | "dinheiro";
export type MovimentacaoTipo =
  | "credito_adicionado"
  | "credito_removido"
  | "credito_usado"
  | "avulso_pix"
  | "avulso_dinheiro";

export type Aluno = {
  id: string;
  nome: string;
  telefone?: string;
  cpf?: string;
  saldo_creditos: number;
  ativo: boolean;
  criado_em: string;
};

export type Usuario = {
  id: string;
  nome: string;
  telefone: string;
  cpf?: string;
  perfil: Perfil;
  ativo: boolean;
  criado_em: string;
};

export type Aula = {
  id: string;
  professor_id: string;
  modalidade: Modalidade;
  data: string;
  horario: string;
  status: "aberta" | "encerrada";
  criado_em: string;
  encerrada_em?: string;
};

export type Participacao = {
  id: string;
  aula_id: string;
  aluno_id: string;
  forma_pagamento: FormaPagamento;
  registrado_em: string;
};

export type Movimentacao = {
  id: string;
  aluno_id: string;
  aula_id?: string;
  usuario_id: string;
  tipo: MovimentacaoTipo;
  quantidade_creditos?: number;
  valor_reais?: number;
  descricao?: string;
  criado_em: string;
};

export type NavItem = {
  aba: Aba;
  label: string;
  icon: ReactNode;
};
