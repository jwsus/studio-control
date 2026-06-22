"use client";

import {
  ArrowLeft,
  CalendarClock,
  ClipboardCheck,
  History,
  LayoutDashboard,
  LineChart,
  UserPlus,
  Users,
} from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { AppHeader, Sidebar } from "./components/navigation";
import { AlunoModal, CadastroAlunoModal, CreditoModal, ProfessorModal, RemoverCreditoModal } from "./components/modals";
import {
  AlunosView,
  AulasView,
  ChamadaView,
  HistoricoView,
  AdminAulaView,
  PainelView,
  ProfessoresView,
  RelatoriosView,
} from "./components/views";
import { alunosIniciais, hoje, usuariosIniciais, valorAulaAvulsa, valorCredito } from "./data";
import type { Aba, Aluno, Aula, FormaPagamento, Modalidade, Movimentacao, Participacao, Usuario } from "./types";
import { agora, criarId, proximoHorarioRedondo } from "./utils";

const professorNavItems = [
  { aba: "painel", label: "Painel geral", icon: <LayoutDashboard size={18} /> },
  { aba: "aulas", label: "Aulas", icon: <CalendarClock size={18} /> },
  { aba: "alunos", label: "Alunos", icon: <Users size={18} /> },
] satisfies { aba: Aba; label: string; icon: React.ReactNode }[];

const adminNavItems = [
  { aba: "painel", label: "Painel geral", icon: <LayoutDashboard size={18} /> },
  { aba: "aulas", label: "Aulas", icon: <CalendarClock size={18} /> },
  { aba: "alunos", label: "Alunos", icon: <Users size={18} /> },
  { aba: "professores", label: "Professores", icon: <UserPlus size={18} /> },
  { aba: "historico", label: "Historico", icon: <History size={18} /> },
  { aba: "relatorios", label: "Relatorios", icon: <LineChart size={18} /> },
] satisfies { aba: Aba; label: string; icon: React.ReactNode }[];

export default function Home() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>("painel");
  const [historicoAbas, setHistoricoAbas] = useState<Aba[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciais);
  const [usuarioAtualId, setUsuarioAtualId] = useState(usuariosIniciais[1].id);
  const [alunos, setAlunos] = useState<Aluno[]>(alunosIniciais);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [participacoes, setParticipacoes] = useState<Participacao[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [aulaAtualId, setAulaAtualId] = useState("");
  const [modalidade, setModalidade] = useState<Modalidade>("pilates");
  const [horario, setHorario] = useState(() => proximoHorarioRedondo());
  const [dataAulaAdmin, setDataAulaAdmin] = useState(hoje);
  const [professorAulaAdminId, setProfessorAulaAdminId] = useState(
    () => usuariosIniciais.find((usuario) => usuario.perfil === "professor" && usuario.ativo)?.id ?? "",
  );
  const [busca, setBusca] = useState("");
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState("");
  const [professorSelecionadoId, setProfessorSelecionadoId] = useState("");
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [modalAlunoAberto, setModalAlunoAberto] = useState(false);
  const [modalCreditoAberto, setModalCreditoAberto] = useState(false);
  const [modalRemoverCreditoAberto, setModalRemoverCreditoAberto] = useState(false);
  const [modalProfessorAberto, setModalProfessorAberto] = useState(false);
  const [toast, setToast] = useState("");

  const usuarioAtual = usuarios.find((usuario) => usuario.id === usuarioAtualId) ?? usuarios[0];
  const isAdmin = usuarioAtual.perfil === "admin";
  const aulaAtual = aulas.find((aula) => aula.id === aulaAtualId);
  const navItems = isAdmin ? adminNavItems : professorNavItems;
  const alunoSelecionado = alunos.find((aluno) => aluno.id === alunoSelecionadoId);
  const aulasVisiveis = isAdmin ? aulas : aulas.filter((aula) => aula.professor_id === usuarioAtual.id);
  const aulasHoje = aulasVisiveis.filter((aula) => aula.data === hoje);
  const alunosAtivos = alunos.filter((aluno) => aluno.ativo);
  const alunosDisponiveisBusca = isAdmin ? alunos : alunosAtivos;
  const professorSelecionado = usuarios.find((usuario) => usuario.id === professorSelecionadoId);

  const alunosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return alunosDisponiveisBusca.filter((aluno) =>
      [aluno.nome, aluno.telefone ?? "", aluno.cpf ?? ""].some((campo) =>
        campo.toLowerCase().includes(termo),
      ),
    );
  }, [alunosDisponiveisBusca, busca]);

  const participantesDaAula = useMemo(() => {
    if (!aulaAtual) return [];
    return participacoes.filter((participacao) => participacao.aula_id === aulaAtual.id);
  }, [aulaAtual, participacoes]);

  const alunosDaChamada = useMemo(() => {
    if (aulaAtual?.status !== "encerrada") return alunosFiltrados;
    const alunoIdsPresentes = new Set(participantesDaAula.map((participacao) => participacao.aluno_id));
    return alunosFiltrados.filter((aluno) => alunoIdsPresentes.has(aluno.id));
  }, [aulaAtual, alunosFiltrados, participantesDaAula]);

  const totalRecebidoHoje = movimentacoes
    .filter((mov) => mov.criado_em.slice(0, 10) === hoje)
    .reduce((total, mov) => total + (mov.valor_reais ?? 0), 0);

  useEffect(() => {
    if (abaAtiva === "chamada" && !aulaAtual) {
      setAbaAtiva("aulas");
    }
  }, [abaAtiva, aulaAtual]);

  function avisar(mensagem: string) {
    setToast(mensagem);
    window.setTimeout(() => setToast(""), 2600);
  }

  function navegarPara(aba: Aba) {
    setAbaAtiva((abaAtual) => {
      if (abaAtual === aba) return abaAtual;
      setHistoricoAbas((historico) => [...historico.slice(-5), abaAtual]);
      setBusca("");
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return aba;
    });
  }

  function voltarAba() {
    setHistoricoAbas((historico) => {
      const abaAnterior = historico[historico.length - 1];
      if (!abaAnterior) return historico;
      setAbaAtiva(abaAnterior);
      setBusca("");
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return historico.slice(0, -1);
    });
  }

  function abrirAula(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (isAdmin) {
      avisar("Use a tela Aulas para criar aula para um professor.");
      return;
    }
    const novaAula: Aula = {
      id: criarId("aula"),
      professor_id: usuarioAtual.id,
      modalidade,
      data: hoje,
      horario,
      status: "aberta",
      criado_em: agora(),
    };
    setAulas((atuais) => [novaAula, ...atuais]);
    setAulaAtualId(novaAula.id);
    setHorario(proximoHorarioRedondo());
    navegarPara("chamada");
    avisar("Aula iniciada. A chamada ja esta pronta.");
  }

  function criarAulaAdmin(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!isAdmin) {
      avisar("Somente admin cria aula para outro professor.");
      return;
    }
    const professor = usuarios.find(
      (usuario) => usuario.id === professorAulaAdminId && usuario.perfil === "professor" && usuario.ativo,
    );
    if (!professor) {
      avisar("Selecione um professor ativo.");
      return;
    }
    if (!dataAulaAdmin || !horario) {
      avisar("Informe data e horario da aula.");
      return;
    }
    const novaAula: Aula = {
      id: criarId("aula"),
      professor_id: professor.id,
      modalidade,
      data: dataAulaAdmin,
      horario,
      status: "aberta",
      criado_em: agora(),
    };
    setAulas((atuais) => [novaAula, ...atuais]);
    setAulaAtualId(novaAula.id);
    setHorario(proximoHorarioRedondo());
    setDataAulaAdmin(hoje);
    avisar(`Aula criada para ${professor.nome}.`);
  }

  function selecionarAula(id: string) {
    setAulaAtualId(id);
    navegarPara("chamada");
  }

  function encerrarAula(id: string) {
    const encerradaEm = agora();
    setAulas((atuais) =>
      atuais.map((aula) => (aula.id === id ? { ...aula, status: "encerrada", encerrada_em: encerradaEm } : aula)),
    );
    avisar("Aula encerrada.");
  }

  function registrarPresenca(aluno: Aluno, forma: FormaPagamento) {
    if (!aulaAtual || aulaAtual.status !== "aberta") return;
    const jaRegistrado = participacoes.some(
      (item) => item.aula_id === aulaAtual.id && item.aluno_id === aluno.id,
    );
    if (jaRegistrado) {
      avisar("Este aluno ja esta registrado nesta aula.");
      return;
    }
    if (forma === "credito" && aluno.saldo_creditos <= 0) {
      avisar("Saldo insuficiente para usar credito.");
      return;
    }

    setParticipacoes((atuais) => [
      {
        id: criarId("part"),
        aula_id: aulaAtual.id,
        aluno_id: aluno.id,
        forma_pagamento: forma,
        registrado_em: agora(),
      },
      ...atuais,
    ]);
    setMovimentacoes((atuais) => [
      {
        id: criarId("mov"),
        aluno_id: aluno.id,
        aula_id: aulaAtual.id,
        usuario_id: usuarioAtual.id,
        tipo:
          forma === "credito"
            ? "credito_usado"
            : forma === "pix"
              ? "avulso_pix"
              : "avulso_dinheiro",
        quantidade_creditos: forma === "credito" ? 1 : undefined,
        valor_reais: forma === "credito" ? undefined : valorAulaAvulsa,
        criado_em: agora(),
      },
      ...atuais,
    ]);
    if (forma === "credito") {
      setAlunos((atuais) =>
        atuais.map((item) =>
          item.id === aluno.id
            ? { ...item, saldo_creditos: Math.max(0, item.saldo_creditos - 1) }
            : item,
        ),
      );
    }
    avisar(`${aluno.nome} adicionado a aula.`);
  }

  function adicionarCreditos(quantidade: number, forma: "pix" | "dinheiro") {
    if (!alunoSelecionado || quantidade <= 0) return;
    setMovimentacoes((atuais) => [
      {
        id: criarId("mov"),
        aluno_id: alunoSelecionado.id,
        aula_id: aulaAtual?.id,
        usuario_id: usuarioAtual.id,
        tipo: "credito_adicionado",
        quantidade_creditos: quantidade,
        valor_reais: quantidade * valorCredito,
        descricao: `Pacote pago em ${forma.toUpperCase()}`,
        criado_em: agora(),
      },
      ...atuais,
    ]);
    setAlunos((atuais) =>
      atuais.map((aluno) =>
        aluno.id === alunoSelecionado.id
          ? { ...aluno, saldo_creditos: aluno.saldo_creditos + quantidade }
          : aluno,
      ),
    );
    setModalCreditoAberto(false);
    avisar("Creditos adicionados.");
  }

  function removerCreditoAdmin(quantidade: number, motivo: string) {
    if (!isAdmin) {
      avisar("Somente admin remove credito.");
      return;
    }
    if (!alunoSelecionado || quantidade <= 0 || quantidade > alunoSelecionado.saldo_creditos || !motivo.trim()) {
      avisar("Informe quantidade e motivo validos.");
      return;
    }
    setMovimentacoes((atuais) => [
      {
        id: criarId("mov"),
        aluno_id: alunoSelecionado.id,
        usuario_id: usuarioAtual.id,
        tipo: "credito_removido",
        quantidade_creditos: quantidade,
        descricao: motivo.trim(),
        criado_em: agora(),
      },
      ...atuais,
    ]);
    setAlunos((atuais) =>
      atuais.map((item) =>
        item.id === alunoSelecionado.id
          ? { ...item, saldo_creditos: Math.max(0, item.saldo_creditos - quantidade) }
          : item,
      ),
    );
    setModalRemoverCreditoAberto(false);
    avisar("Creditos removidos pelo admin.");
  }

  function cadastrarAluno(nome: string, telefone: string, cpf: string, creditos: number) {
    const novoAluno: Aluno = {
      id: criarId("aluno"),
      nome,
      telefone: telefone || undefined,
      cpf: cpf || undefined,
      saldo_creditos: creditos,
      ativo: true,
      criado_em: agora(),
    };
    setAlunos((atuais) => [novoAluno, ...atuais]);
    if (creditos > 0) {
      setMovimentacoes((atuais) => [
        {
          id: criarId("mov"),
          aluno_id: novoAluno.id,
          usuario_id: usuarioAtual.id,
          tipo: "credito_adicionado",
          quantidade_creditos: creditos,
          valor_reais: creditos * valorCredito,
          descricao: "Credito inicial",
          criado_em: agora(),
        },
        ...atuais,
      ]);
    }
    setAlunoSelecionadoId(novoAluno.id);
    setModalCadastroAberto(false);
    avisar("Aluno cadastrado.");
  }

  function abrirEditarAluno(alunoId: string) {
    setAlunoSelecionadoId(alunoId);
    setModalAlunoAberto(true);
  }

  function salvarAluno(dados: { nome: string; telefone: string; cpf: string; ativo: boolean }) {
    if (!isAdmin) {
      avisar("Somente admin altera alunos.");
      return;
    }
    if (!alunoSelecionado) return;

    setAlunos((atuais) =>
      atuais.map((aluno) =>
        aluno.id === alunoSelecionado.id
          ? {
              ...aluno,
              nome: dados.nome,
              telefone: dados.telefone || undefined,
              cpf: dados.cpf || undefined,
              ativo: dados.ativo,
            }
          : aluno,
      ),
    );
    setModalAlunoAberto(false);
    setAlunoSelecionadoId("");
    avisar("Aluno atualizado.");
  }

  function abrirNovoProfessor() {
    setProfessorSelecionadoId("");
    setModalProfessorAberto(true);
  }

  function abrirEditarProfessor(professorId: string) {
    setProfessorSelecionadoId(professorId);
    setModalProfessorAberto(true);
  }

  function salvarProfessor(dados: { nome: string; telefone: string; cpf: string; ativo: boolean }) {
    if (!isAdmin) {
      avisar("Somente admin altera professores.");
      return;
    }

    if (professorSelecionado) {
      setUsuarios((atuais) =>
        atuais.map((usuario) =>
          usuario.id === professorSelecionado.id
            ? {
                ...usuario,
                nome: dados.nome,
                telefone: dados.telefone,
                cpf: dados.cpf || undefined,
                ativo: dados.ativo,
              }
            : usuario,
        ),
      );
      avisar("Professor atualizado.");
    } else {
      const novoProfessor: Usuario = {
        id: criarId("user"),
        nome: dados.nome,
        telefone: dados.telefone,
        cpf: dados.cpf || undefined,
        perfil: "professor",
        ativo: dados.ativo,
        criado_em: agora(),
      };
      setUsuarios((atuais) => [novoProfessor, ...atuais]);
      avisar("Professor cadastrado.");
    }

    setModalProfessorAberto(false);
    setProfessorSelecionadoId("");
  }

  function abrirCredito(alunoId: string) {
    setAlunoSelecionadoId(alunoId);
    setModalCreditoAberto(true);
  }

  function abrirRemocaoCredito(alunoId: string) {
    setAlunoSelecionadoId(alunoId);
    setModalRemoverCreditoAberto(true);
  }

  function trocarUsuario(id: string) {
    setUsuarioAtualId(id);
    setAbaAtiva("painel");
    setHistoricoAbas([]);
    setBusca("");
  }

  return (
    <main className="app-shell">
      <AppHeader
        aulaStatus={aulaAtual ? `${aulaAtual.horario} em andamento` : "Nenhuma aula selecionada"}
        usuarios={usuarios}
        usuarioAtual={usuarioAtual}
        onUsuarioChange={trocarUsuario}
        brandIcon={<ClipboardCheck size={21} />}
      />

      {historicoAbas.length > 0 ? (
        <button className="mobile-back-button" type="button" onClick={voltarAba} aria-label="Voltar">
          <ArrowLeft size={21} />
        </button>
      ) : null}

      <div className="workspace">
        <Sidebar items={navItems} abaAtiva={abaAtiva} onChange={navegarPara} />

        <section className="content-panel">
          {abaAtiva === "painel" ? (
            <PainelView
              aulasHoje={aulasHoje}
              totalRecebido={totalRecebidoHoje}
              isAdmin={isAdmin}
              modalidade={modalidade}
              horario={horario}
              onModalidadeChange={setModalidade}
              onHorarioChange={setHorario}
              onAbrirAula={abrirAula}
              onAulasClick={() => navegarPara("aulas")}
              onChamadaClick={() => navegarPara(isAdmin ? "alunos" : "chamada")}
              onSelecionarAula={selecionarAula}
              onNovoAluno={() => setModalCadastroAberto(true)}
            />
          ) : null}

          {abaAtiva === "aulas" ? (
            isAdmin ? (
              <AdminAulaView
                aulas={aulasVisiveis}
                usuarios={usuarios}
                participacoes={participacoes}
                movimentacoes={movimentacoes}
                modalidade={modalidade}
                horario={horario}
                data={dataAulaAdmin}
                professorId={professorAulaAdminId}
                onModalidadeChange={setModalidade}
                onHorarioChange={setHorario}
                onDataChange={setDataAulaAdmin}
                onProfessorChange={setProfessorAulaAdminId}
                onCriarAula={criarAulaAdmin}
                onSelecionarAula={selecionarAula}
              />
            ) : (
              <AulasView
                aulas={aulasHoje}
                participacoes={participacoes}
                aulaAtualId={aulaAtualId}
                modalidade={modalidade}
                horario={horario}
                onModalidadeChange={setModalidade}
                onHorarioChange={setHorario}
                onAbrirAula={abrirAula}
                onSelecionarAula={selecionarAula}
                onEncerrarAula={encerrarAula}
              />
            )
          ) : null}

          {abaAtiva === "chamada" ? (
            <ChamadaView
              aulaAtual={aulaAtual}
              alunos={alunosDaChamada}
              busca={busca}
              participacoes={participacoes}
              onBuscaChange={setBusca}
              onRegistrar={registrarPresenca}
              onCredito={abrirCredito}
              onEncerrarAula={encerrarAula}
              onNovoAluno={() => setModalCadastroAberto(true)}
            />
          ) : null}

          {abaAtiva === "alunos" ? (
            <AlunosView
              alunos={alunosFiltrados}
              busca={busca}
              isAdmin={isAdmin}
              onBuscaChange={setBusca}
              onCredito={abrirCredito}
              onEditarAluno={abrirEditarAluno}
              onRemoverCredito={abrirRemocaoCredito}
              onNovoAluno={() => setModalCadastroAberto(true)}
            />
          ) : null}

          {abaAtiva === "professores" && isAdmin ? (
            <ProfessoresView
              usuarios={usuarios}
              onNovoProfessor={abrirNovoProfessor}
              onEditarProfessor={abrirEditarProfessor}
            />
          ) : null}

          {abaAtiva === "historico" && isAdmin ? (
            <HistoricoView alunos={alunos} usuarios={usuarios} movimentacoes={movimentacoes} />
          ) : null}

          {abaAtiva === "relatorios" && isAdmin ? (
              <RelatoriosView aulas={aulas} movimentacoes={movimentacoes} usuarios={usuarios} />
          ) : null}
        </section>
      </div>

      {modalCadastroAberto ? (
        <CadastroAlunoModal onClose={() => setModalCadastroAberto(false)} onSubmit={cadastrarAluno} />
      ) : null}

      {modalAlunoAberto && alunoSelecionado ? (
        <AlunoModal
          aluno={alunoSelecionado}
          onClose={() => {
            setModalAlunoAberto(false);
            setAlunoSelecionadoId("");
          }}
          onSubmit={salvarAluno}
        />
      ) : null}

      {modalCreditoAberto && alunoSelecionado ? (
        <CreditoModal aluno={alunoSelecionado} onClose={() => setModalCreditoAberto(false)} onSubmit={adicionarCreditos} />
      ) : null}

      {modalRemoverCreditoAberto && alunoSelecionado ? (
        <RemoverCreditoModal
          aluno={alunoSelecionado}
          onClose={() => setModalRemoverCreditoAberto(false)}
          onSubmit={removerCreditoAdmin}
        />
      ) : null}

      {modalProfessorAberto ? (
        <ProfessorModal
          professor={professorSelecionado}
          onClose={() => {
            setModalProfessorAberto(false);
            setProfessorSelecionadoId("");
          }}
          onSubmit={salvarProfessor}
        />
      ) : null}

      {toast ? <div className="toast">{toast}</div> : null}
    </main>
  );
}
