import type { Aluno, Aula, Movimentacao, Participacao, Usuario } from "./types";

export const hoje = new Date().toISOString().slice(0, 10);
export const valorAulaAvulsa = 10;
export const valorCredito = 10;

const nomesAlunosTeoricos = [
  "Ana Clara Mendes",
  "Beatriz Oliveira",
  "Carolina Ribeiro",
  "Daniela Martins",
  "Eduarda Fernandes",
  "Fernanda Lima",
  "Gabriela Rocha",
  "Helena Cardoso",
  "Isabela Nogueira",
  "Juliana Barbosa",
  "Larissa Teixeira",
  "Mariana Castro",
  "Natalia Almeida",
  "Patricia Moreira",
  "Renata Duarte",
  "Sofia Azevedo",
  "Tatiane Ramos",
  "Valeria Correia",
  "Amanda Vieira",
  "Bianca Carvalho",
  "Bruno Andrade",
  "Caio Martins",
  "Diego Souza",
  "Eduardo Pereira",
  "Felipe Gomes",
  "Gustavo Henrique",
  "Henrique Batista",
  "Igor Matheus",
  "Joao Victor",
  "Lucas Gabriel",
  "Marcos Vinicius",
  "Mateus Almeida",
  "Pedro Henrique",
  "Rafael Costa",
  "Rodrigo Nunes",
  "Thiago Moreira",
  "Victor Hugo",
  "Andre Luiz",
  "Carlos Eduardo",
  "Leonardo Ramos",
  "Aline Moraes",
  "Camila Torres",
  "Debora Cristina",
  "Elaine Farias",
  "Flavia Rezende",
  "Leticia Campos",
  "Priscila Monteiro",
  "Raquel Freitas",
  "Simone Lopes",
  "Vanessa Martins",
];

const alunosTeoricos: Aluno[] = nomesAlunosTeoricos.map((nome, index) => ({
  id: `teorico_${index + 1}`,
  nome,
  saldo_creditos: index < 15 ? 2 + (index % 5) : 0,
  ativo: true,
  criado_em: new Date().toISOString(),
}));

export const usuariosIniciais: Usuario[] = [
  {
    id: "u_admin",
    nome: "Renato Lima",
    telefone: "(11) 97777-4433",
    perfil: "admin",
    ativo: true,
    criado_em: new Date().toISOString(),
  },
  {
    id: "u_prof",
    nome: "Marina Alves",
    telefone: "(11) 98888-1122",
    perfil: "professor",
    ativo: true,
    criado_em: new Date().toISOString(),
  },
  {
    id: "u_prof_lais",
    nome: "Lais Carvalho",
    telefone: "(11) 95555-0188",
    perfil: "professor",
    ativo: true,
    criado_em: new Date().toISOString(),
  },
  {
    id: "u_prof_rafael",
    nome: "Rafael Nogueira",
    telefone: "(11) 94444-0277",
    perfil: "professor",
    ativo: true,
    criado_em: new Date().toISOString(),
  },
];

export const alunosIniciais: Aluno[] = [
  {
    id: "a1",
    nome: "Camila Santos",
    telefone: "(11) 99921-1000",
    cpf: "123.456.789-00",
    saldo_creditos: 6,
    ativo: true,
    criado_em: new Date().toISOString(),
  },
  {
    id: "a2",
    nome: "Joao Pereira",
    telefone: "(11) 98810-2040",
    cpf: "321.654.987-00",
    saldo_creditos: 4,
    ativo: true,
    criado_em: new Date().toISOString(),
  },
  {
    id: "a3",
    nome: "Bruna Costa",
    telefone: "(11) 97654-3210",
    cpf: "111.222.333-44",
    saldo_creditos: 8,
    ativo: true,
    criado_em: new Date().toISOString(),
  },
  ...alunosTeoricos,
];

const professoresComHistorico = [
  { id: "u_prof", horarios: ["08:00", "17:00"] },
  { id: "u_prof_lais", horarios: ["07:00", "12:00", "18:00"] },
  { id: "u_prof_rafael", horarios: ["09:00", "16:00"] },
];

function dataHistorica(diasAtras: number) {
  const data = new Date();
  data.setHours(12, 0, 0, 0);
  data.setDate(data.getDate() - diasAtras);
  return data.toISOString().slice(0, 10);
}

function dataHoraHistorica(data: string, horario: string, minutos = 0) {
  return `${data}T${horario}:00.000-03:00`.replace(":00:00.000", `:${String(minutos).padStart(2, "0")}:00.000`);
}

function horariosDoProfessor(horariosBase: string[], professorIndex: number, diasAtras: number) {
  const horarios = [...horariosBase];

  if (professorIndex === 0 && diasAtras % 4 === 0) horarios.push("19:00");
  if (professorIndex === 1 && diasAtras % 5 === 0) horarios.push("20:00");
  if (professorIndex === 2 && diasAtras % 6 === 0) horarios.push("18:30");
  if (professorIndex === 0 && diasAtras % 11 === 0) horarios.shift();
  if (professorIndex === 1 && diasAtras % 7 === 0) horarios.splice(1, 1);
  if (professorIndex === 2 && diasAtras % 4 === 0) horarios.pop();

  return horarios;
}

const aulasHistoricas: Aula[] = [];
const participacoesHistoricas: Participacao[] = [];
const movimentacoesHistoricas: Movimentacao[] = [];

for (let diasAtras = 1; diasAtras <= 30; diasAtras += 1) {
  const data = dataHistorica(diasAtras);

  professoresComHistorico.forEach((professor, professorIndex) => {
    horariosDoProfessor(professor.horarios, professorIndex, diasAtras).forEach((horario, aulaIndex) => {
      const aulaId = `hist_aula_${professor.id}_${data}_${aulaIndex + 1}`;
      const criadaEm = dataHoraHistorica(data, horario);
      const encerradaEm = dataHoraHistorica(data, horario, 50);
      const modalidade = (aulaIndex + professorIndex + diasAtras) % 4 === 0 ? "musculacao" : "pilates";
      const valorAulaHistorica = modalidade === "pilates" ? 15 : valorAulaAvulsa;
      const quantidadeAlunos = 4 + ((diasAtras + professorIndex + aulaIndex) % 4);

      aulasHistoricas.push({
        id: aulaId,
        professor_id: professor.id,
        modalidade,
        data,
        horario,
        status: "encerrada",
        criado_em: criadaEm,
        encerrada_em: encerradaEm,
      });

      for (let posicaoAluno = 0; posicaoAluno < quantidadeAlunos; posicaoAluno += 1) {
        const alunoIndex =
          (diasAtras * 7 + professorIndex * 11 + aulaIndex * 5 + posicaoAluno) % alunosIniciais.length;
        const aluno = alunosIniciais[alunoIndex];
        const formaPagamento = (posicaoAluno + aulaIndex + diasAtras) % 3 === 0 ? "dinheiro" : "pix";
        const registradoEm = dataHoraHistorica(data, horario, 5 + posicaoAluno * 4);

        participacoesHistoricas.push({
          id: `hist_part_${aulaId}_${posicaoAluno + 1}`,
          aula_id: aulaId,
          aluno_id: aluno.id,
          forma_pagamento: formaPagamento,
          registrado_em: registradoEm,
        });

        movimentacoesHistoricas.push({
          id: `hist_mov_${aulaId}_${posicaoAluno + 1}`,
          aluno_id: aluno.id,
          aula_id: aulaId,
          usuario_id: professor.id,
          tipo: formaPagamento === "pix" ? "avulso_pix" : "avulso_dinheiro",
          valor_reais: valorAulaHistorica,
          descricao: "Aula avulsa registrada no historico inicial",
          criado_em: registradoEm,
        });
      }
    });
  });
}

export const aulasIniciais = aulasHistoricas;
export const participacoesIniciais = participacoesHistoricas;
export const movimentacoesIniciais = movimentacoesHistoricas;
