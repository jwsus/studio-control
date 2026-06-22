import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import {
  Banknote,
  CalendarCheck,
  CalendarClock,
  Check,
  CircleDollarSign,
  Clock,
  Coins,
  Pencil,
  Plus,
  Search,
  UserPlus,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { hoje } from "../data";
import type { Aluno, Aula, FormaPagamento, Modalidade, Movimentacao, Participacao } from "../types";
import type { Usuario } from "../types";
import { formatarData, formatarDataHora, moeda, rotuloPagamento, rotuloTipo } from "../utils";
import { AulaForm } from "./aula-form";
import { Metric } from "./metric";

export function PainelView(props: {
  aulasHoje: Aula[];
  totalRecebido: number;
  isAdmin: boolean;
  modalidade: Modalidade;
  horario: string;
  onModalidadeChange: (valor: Modalidade) => void;
  onHorarioChange: (valor: string) => void;
  onAbrirAula: (event?: FormEvent<HTMLFormElement>) => void;
  onAulasClick: () => void;
  onChamadaClick: () => void;
  onSelecionarAula: (id: string) => void;
  onNovoAluno: () => void;
}) {
  const aulaAberta = props.aulasHoje.find((aula) => aula.status === "aberta");

  return (
    <div className="stack">
      <div className="section-heading">
        <div>
          <h2>{props.isAdmin ? "Resumo do dia" : "Aulas de hoje"}</h2>
          <p>
            {props.isAdmin
              ? "Valor recebido hoje e quantidade de aulas abertas."
              : "Inicie uma aula ou entre rapidamente em uma aula aberta."}
          </p>
        </div>
        <span className="date-chip">{formatarData(hoje)}</span>
      </div>

      {props.isAdmin ? (
        <div className="stats-grid admin-day-summary">
          <Metric icon={<CircleDollarSign size={22} />} label="Valor do dia" value={moeda.format(props.totalRecebido)} color="blue" />
          <Metric icon={<CalendarClock size={22} />} label="Quantidade de aulas" value={props.aulasHoje.length} color="violet" />
        </div>
      ) : null}

      {!props.isAdmin ? (
        <div className="professor-home">
          <section className={`section action-section start-lesson ${aulaAberta ? "minimized" : ""}`}>
            {aulaAberta ? (
              <div className="active-lesson-strip">
                <div>
                  <span>Aula ativa</span>
                  <strong>
                    {aulaAberta.modalidade === "pilates" ? "Pilates" : "Musculacao"} as {aulaAberta.horario}
                  </strong>
                </div>
                <button className="btn primary" type="button" onClick={() => props.onSelecionarAula(aulaAberta.id)}>
                  <CalendarCheck size={18} />
                  Chamada
                </button>
              </div>
            ) : (
              <>
                <div>
                  <h3>Nova aula</h3>
                </div>
                <AulaForm
                  modalidade={props.modalidade}
                  horario={props.horario}
                  onModalidadeChange={props.onModalidadeChange}
                  onHorarioChange={props.onHorarioChange}
                  onAbrirAula={props.onAbrirAula}
                />
              </>
            )}
          </section>
        </div>
      ) : null}

      <section className="section">
        <div className="section-heading inline">
          <div>
            <h3>Aulas de hoje</h3>
            <p>{props.isAdmin ? "Toque para ver detalhes da aula." : "Toque em uma aula para abrir a chamada."}</p>
          </div>
        </div>
        <AulasLista aulas={props.aulasHoje} isAdmin={props.isAdmin} onSelecionarAula={props.onSelecionarAula} />
      </section>
    </div>
  );
}

export function AulasView(props: {
  aulas: Aula[];
  participacoes: Participacao[];
  aulaAtualId: string;
  modalidade: Modalidade;
  horario: string;
  onModalidadeChange: (valor: Modalidade) => void;
  onHorarioChange: (valor: string) => void;
  onAbrirAula: (event?: FormEvent<HTMLFormElement>) => void;
  onSelecionarAula: (id: string) => void;
  onEncerrarAula: (id: string) => void;
}) {
  return (
    <div className="stack">
      <div className="section-heading">
        <div>
          <h2>Aulas</h2>
          <p>Inicie, acompanhe e entre na chamada das aulas do dia.</p>
        </div>
      </div>
      <section className="section">
        <AulaForm
          compact
          modalidade={props.modalidade}
          horario={props.horario}
          onModalidadeChange={props.onModalidadeChange}
          onHorarioChange={props.onHorarioChange}
          onAbrirAula={props.onAbrirAula}
        />
      </section>
      <section className="section">
        <h3>Aulas de hoje</h3>
        <div className="lesson-list">
          {props.aulas.map((aula) => {
            const presentes = props.participacoes.filter((item) => item.aula_id === aula.id).length;
            return (
              <div className={`lesson-row ${props.aulaAtualId === aula.id ? "selected" : ""}`} key={aula.id}>
                <div className="lesson-time">
                  <Clock size={18} />
                  <strong>{aula.horario}</strong>
                </div>
                <div className="lesson-main">
                  <strong>{aula.modalidade === "pilates" ? "Pilates" : "Musculacao"}</strong>
                  <span>{presentes} presentes</span>
                </div>
                <span className={`pill ${aula.status === "aberta" ? "green" : "rose"}`}>{aula.status}</span>
                <div className="button-row nowrap">
                  <button className="btn ghost" type="button" onClick={() => props.onSelecionarAula(aula.id)}>
                    {aula.status === "encerrada" ? "Ver aula" : "Chamada"}
                  </button>
                  <button
                    className="btn rose"
                    type="button"
                    disabled={aula.status === "encerrada"}
                    onClick={() => props.onEncerrarAula(aula.id)}
                  >
                    Encerrar
                  </button>
                </div>
              </div>
            );
          })}
          {props.aulas.length === 0 ? <div className="empty">Nenhuma aula iniciada hoje.</div> : null}
        </div>
      </section>
    </div>
  );
}

function AulasLista(props: { aulas: Aula[]; isAdmin?: boolean; onSelecionarAula: (id: string) => void }) {
  if (props.aulas.length === 0) {
    return <div className="empty">Nenhuma aula iniciada hoje.</div>;
  }
  const aulasVisiveis = props.isAdmin ? props.aulas : props.aulas.slice(0, 4);

  return (
    <div className="mini-list">
      {aulasVisiveis.map((aula) => (
        <button className="mini-row clickable" key={aula.id} type="button" onClick={() => props.onSelecionarAula(aula.id)}>
          <span>{props.isAdmin ? `${formatarData(aula.data)} ${aula.horario}` : aula.horario}</span>
          <strong>{aula.modalidade === "pilates" ? "Pilates" : "Musculacao"}</strong>
          <span className={`pill ${aula.status === "aberta" ? "green" : "rose"}`}>{aula.status}</span>
          <span className="mini-action">
            {aula.status === "encerrada" ? "Ver aula" : "Abrir chamada"}
          </span>
        </button>
      ))}
    </div>
  );
}

export function AdminAulaView(props: {
  aulas: Aula[];
  usuarios: Usuario[];
  participacoes: Participacao[];
  movimentacoes: Movimentacao[];
  modalidade: Modalidade;
  horario: string;
  data: string;
  professorId: string;
  onModalidadeChange: (valor: Modalidade) => void;
  onHorarioChange: (valor: string) => void;
  onDataChange: (valor: string) => void;
  onProfessorChange: (valor: string) => void;
  onCriarAula: (event?: FormEvent<HTMLFormElement>) => void;
  onSelecionarAula: (id: string) => void;
}) {
  const professores = props.usuarios.filter((usuario) => usuario.perfil === "professor" && usuario.ativo);

  return (
    <div className="stack">
      <div className="section-heading">
        <div>
          <h2>Aulas</h2>
          <p>Crie aulas para os professores e acompanhe os detalhes.</p>
        </div>
      </div>

      <section className="section">
        <h3>Nova aula</h3>
        <AulaForm
          compact
          modalidade={props.modalidade}
          horario={props.horario}
          data={props.data}
          professorId={props.professorId}
          professores={professores}
          onModalidadeChange={props.onModalidadeChange}
          onHorarioChange={props.onHorarioChange}
          onDataChange={props.onDataChange}
          onProfessorChange={props.onProfessorChange}
          onAbrirAula={props.onCriarAula}
        />
      </section>

      <section className="section">
        <h3>Aulas cadastradas</h3>
        <AdminAulasLista
          aulas={props.aulas}
          usuarios={props.usuarios}
          participacoes={props.participacoes}
          movimentacoes={props.movimentacoes}
          onSelecionarAula={props.onSelecionarAula}
        />
      </section>
    </div>
  );
}

function AdminAulasLista(props: {
  aulas: Aula[];
  usuarios: Usuario[];
  participacoes: Participacao[];
  movimentacoes: Movimentacao[];
  onSelecionarAula: (id: string) => void;
}) {
  if (props.aulas.length === 0) {
    return <div className="empty">Nenhuma aula cadastrada.</div>;
  }

  return (
    <div className="admin-class-list">
      {props.aulas.map((aula) => {
        const professor = props.usuarios.find((usuario) => usuario.id === aula.professor_id);
        const participacoesDaAula = props.participacoes.filter((participacao) => participacao.aula_id === aula.id);
        const totalAula = props.movimentacoes
          .filter((mov) => mov.aula_id === aula.id)
          .reduce((soma, mov) => soma + (mov.valor_reais ?? 0), 0);

        return (
          <article className="admin-class-card" key={aula.id}>
            <button className="admin-class-summary" type="button" onClick={() => props.onSelecionarAula(aula.id)}>
              <span>
                {formatarData(aula.data)} as {aula.horario}
              </span>
              <strong>{aula.modalidade === "pilates" ? "Pilates" : "Musculacao"}</strong>
              <small>Professor: {professor?.nome ?? "Professor nao informado"}</small>
              <span className={`pill ${aula.status === "aberta" ? "green" : "rose"}`}>{aula.status}</span>
              <b>{participacoesDaAula.length} presentes</b>
              <b>{moeda.format(totalAula)}</b>
              <span className="mini-action">{aula.status === "encerrada" ? "Ver chamada" : "Abrir chamada"}</span>
              <div className="admin-class-details">
                <small>Iniciada em {formatarDataHora(aula.criado_em)}</small>
                <small>
                  {aula.encerrada_em ? `Encerrada em ${formatarDataHora(aula.encerrada_em)}` : "Encerramento em andamento"}
                </small>
              </div>
            </button>
          </article>
        );
      })}
    </div>
  );
}

export function ChamadaView(props: {
  aulaAtual?: Aula;
  alunos: Aluno[];
  busca: string;
  participacoes: Participacao[];
  onBuscaChange: (valor: string) => void;
  onRegistrar: (aluno: Aluno, forma: FormaPagamento) => void;
  onCredito: (alunoId: string) => void;
  onEncerrarAula: (id: string) => void;
  onNovoAluno: () => void;
}) {
  return (
    <div className="stack">
      <div className="attendance-sticky">
        <div className="section-heading attendance-heading">
          <div>
            <h2>Chamada da aula</h2>
            <p>
              {props.aulaAtual
                ? `${props.aulaAtual.modalidade} as ${props.aulaAtual.horario}`
                : "Selecione uma aula antes de fazer a chamada."}
            </p>
          </div>
          {props.aulaAtual ? (
            <div className="button-row">
              <span className={`pill ${props.aulaAtual.status === "aberta" ? "green" : "rose"}`}>
                {props.aulaAtual.status}
              </span>
              {props.aulaAtual.status === "aberta" ? (
                <button
                  className="btn rose"
                  type="button"
                  onClick={() => props.onEncerrarAula(props.aulaAtual!.id)}
                >
                  Encerrar aula
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="toolbar attendance-toolbar">
          <div className="search-field">
            <Search size={17} />
            <input
              value={props.busca}
              placeholder="Buscar aluno por nome, telefone ou CPF"
              onChange={(event) => props.onBuscaChange(event.target.value)}
            />
          </div>
          <button className="btn ghost" type="button" onClick={props.onNovoAluno}>
            <UserPlus size={18} />
            Novo aluno
          </button>
        </div>
      </div>

      <div className="attendance-list">
        {props.alunos.map((aluno) => {
          const participacao = props.participacoes.find(
            (item) => item.aula_id === props.aulaAtual?.id && item.aluno_id === aluno.id,
          );
          const aulaBloqueada = !props.aulaAtual || props.aulaAtual.status !== "aberta";

          return (
            <article className={`attendance-card ${participacao ? "done" : ""}`} key={aluno.id}>
              <div className="attendance-main">
                <div className="student-cell">
                  <span>{aluno.nome.slice(0, 2)}</span>
                  <div>
                    <strong>{aluno.nome}</strong>
                    <small>{aluno.telefone ?? "Sem telefone"}</small>
                  </div>
                </div>
                <div className="student-credit-actions">
                  <span className={`balance ${aluno.saldo_creditos > 0 ? "ok" : "low"}`}>
                    {aluno.saldo_creditos} creditos
                  </span>
                  <button className="btn icon ghost" type="button" onClick={() => props.onCredito(aluno.id)} aria-label="Adicionar creditos">
                    <Plus size={17} />
                  </button>
                </div>
              </div>

              {participacao ? (
                <div className="attendance-done">
                  <span className="pill green">{rotuloPagamento(participacao.forma_pagamento)}</span>
                  <small>{formatarDataHora(participacao.registrado_em)}</small>
                </div>
              ) : (
                <div className="attendance-actions">
                  <button
                    className="btn success"
                    type="button"
                    disabled={aulaBloqueada || aluno.saldo_creditos <= 0}
                    onClick={() => props.onRegistrar(aluno, "credito")}
                  >
                    <Check size={17} />
                    Credito
                  </button>
                  <button
                    className="btn blue"
                    type="button"
                    disabled={aulaBloqueada}
                    onClick={() => props.onRegistrar(aluno, "pix")}
                  >
                    <Wallet size={17} />
                    PIX
                  </button>
                  <button
                    className="btn ghost"
                    type="button"
                    disabled={aulaBloqueada}
                    onClick={() => props.onRegistrar(aluno, "dinheiro")}
                  >
                    <Banknote size={17} />
                    Dinheiro
                  </button>
                </div>
              )}
            </article>
          );
        })}
        {props.alunos.length === 0 ? (
          <div className="empty">
            {props.aulaAtual?.status === "encerrada"
              ? "Nenhum aluno presente nesta aula."
              : "Nenhum aluno encontrado."}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function AlunosView(props: {
  alunos: Aluno[];
  busca: string;
  isAdmin: boolean;
  onBuscaChange: (valor: string) => void;
  onCredito: (alunoId: string) => void;
  onEditarAluno?: (alunoId: string) => void;
  onRemoverCredito?: (alunoId: string) => void;
  onNovoAluno: () => void;
}) {
  return (
    <div className="stack">
      <div className="section-heading">
        <div>
          <h2>Alunos e saldos</h2>
          <p>Consulte contatos e faca recargas de credito.</p>
        </div>
        <button className="btn primary" type="button" onClick={props.onNovoAluno}>
          <UserPlus size={18} />
          Novo aluno
        </button>
      </div>
      <div className="toolbar">
        <div className="search-field">
          <Search size={17} />
          <input
            value={props.busca}
            placeholder="Buscar aluno"
            onChange={(event) => props.onBuscaChange(event.target.value)}
          />
        </div>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Telefone</th>
              <th>Credito disponivel</th>
              <th>Status</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {props.alunos.map((aluno) => (
              <tr key={aluno.id}>
                <td>
                  <div className="student-cell">
                    <span>{aluno.nome.slice(0, 2)}</span>
                    <strong>{aluno.nome}</strong>
                  </div>
                </td>
                <td data-label="Telefone">{aluno.telefone ?? "Sem telefone"}</td>
                <td data-label="Credito">
                  <span className={`balance ${aluno.saldo_creditos > 0 ? "ok" : "low"}`}>
                    {aluno.saldo_creditos} creditos
                  </span>
                </td>
                <td data-label="Status">
                  <span className={`pill ${aluno.ativo ? "green" : "rose"}`}>
                    {aluno.ativo ? "ativo" : "inativo"}
                  </span>
                </td>
                <td data-label="Acoes">
                  <div className="button-row nowrap">
                    <button className="btn ghost" type="button" onClick={() => props.onCredito(aluno.id)}>
                      <Coins size={17} />
                      Recarga
                    </button>
                    {props.isAdmin ? (
                      <button className="btn ghost" type="button" onClick={() => props.onEditarAluno?.(aluno.id)}>
                        <Pencil size={17} />
                        Editar
                      </button>
                    ) : null}
                    {props.isAdmin ? (
                      <button
                        className="btn rose"
                        type="button"
                        disabled={aluno.saldo_creditos <= 0}
                        onClick={() => props.onRemoverCredito?.(aluno.id)}
                      >
                        <X size={17} />
                        Remover
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {props.alunos.length === 0 ? <div className="empty">Nenhum aluno encontrado.</div> : null}
      </div>
    </div>
  );
}

export function ProfessoresView(props: {
  usuarios: Usuario[];
  onNovoProfessor: () => void;
  onEditarProfessor: (professorId: string) => void;
}) {
  const professores = props.usuarios.filter((usuario) => usuario.perfil === "professor");
  return (
    <div className="stack">
      <div className="section-heading">
        <div>
          <h2>Professores</h2>
          <p>Cadastro e status dos professores do estudio.</p>
        </div>
        <button className="btn primary" type="button" onClick={props.onNovoProfessor}>
          <UserPlus size={18} />
          Novo professor
        </button>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Professor</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {professores.map((professor) => (
              <tr key={professor.id}>
                <td>
                  <div className="student-cell">
                    <span>{professor.nome.slice(0, 2)}</span>
                    <strong>{professor.nome}</strong>
                  </div>
                </td>
                <td data-label="Telefone">{professor.telefone}</td>
                <td data-label="Status">
                  <span className={`pill ${professor.ativo ? "green" : "rose"}`}>
                    {professor.ativo ? "ativo" : "inativo"}
                  </span>
                </td>
                <td data-label="Acoes">
                  <button className="btn ghost" type="button" onClick={() => props.onEditarProfessor(professor.id)}>
                    <Pencil size={17} />
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {professores.length === 0 ? <div className="empty">Nenhum professor cadastrado.</div> : null}
      </div>
    </div>
  );
}

export function RelatoriosView(props: {
  aulas: Aula[];
  movimentacoes: Movimentacao[];
  usuarios: Usuario[];
}) {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [modalidadeFiltro, setModalidadeFiltro] = useState<Modalidade | "todos">("todos");
  const [professorFiltro, setProfessorFiltro] = useState("todos");
  const professoresRelatorio = props.usuarios.filter((usuario) => usuario.perfil === "professor");

  const aulasFiltradas = useMemo(
    () =>
      props.aulas.filter((aula) => {
        if (dataInicio && aula.data < dataInicio) return false;
        if (dataFim && aula.data > dataFim) return false;
        if (modalidadeFiltro !== "todos" && aula.modalidade !== modalidadeFiltro) return false;
        if (professorFiltro !== "todos" && aula.professor_id !== professorFiltro) return false;
        return true;
      }),
    [props.aulas, dataInicio, dataFim, modalidadeFiltro, professorFiltro],
  );

  const aulaIdsFiltrados = useMemo(() => new Set(aulasFiltradas.map((aula) => aula.id)), [aulasFiltradas]);
  const movimentacoesFiltradas = useMemo(
    () =>
      props.movimentacoes.filter((mov) => {
        const dataMov = mov.criado_em.slice(0, 10);
        if (dataInicio && dataMov < dataInicio) return false;
        if (dataFim && dataMov > dataFim) return false;
        if (modalidadeFiltro === "todos" && professorFiltro === "todos") return true;
        if (modalidadeFiltro === "todos" && professorFiltro !== "todos" && !mov.aula_id) {
          return mov.usuario_id === professorFiltro;
        }
        return Boolean(mov.aula_id && aulaIdsFiltrados.has(mov.aula_id));
      }),
    [props.movimentacoes, aulaIdsFiltrados, dataInicio, dataFim, modalidadeFiltro, professorFiltro],
  );

  const total = movimentacoesFiltradas.reduce((soma, mov) => soma + (mov.valor_reais ?? 0), 0);
  const porProfessor = professoresRelatorio
    .filter((professor) => professorFiltro === "todos" || professor.id === professorFiltro)
    .map((professor) => {
      const aulasProfessor = aulasFiltradas.filter((aula) => aula.professor_id === professor.id);
      const aulaIds = new Set(aulasProfessor.map((aula) => aula.id));
      const recebido = movimentacoesFiltradas
        .filter((mov) => mov.aula_id && aulaIds.has(mov.aula_id))
        .reduce((soma, mov) => soma + (mov.valor_reais ?? 0), 0);
      return { professor, aulas: aulasProfessor.length, recebido };
    });
  const porModalidade = (["pilates", "musculacao"] satisfies Modalidade[]).map((modalidade) => {
    const aulasModalidade = aulasFiltradas.filter((aula) => aula.modalidade === modalidade);
    const aulaIds = new Set(aulasModalidade.map((aula) => aula.id));
    const recebido = movimentacoesFiltradas
      .filter((mov) => mov.aula_id && aulaIds.has(mov.aula_id))
      .reduce((soma, mov) => soma + (mov.valor_reais ?? 0), 0);
    return { modalidade, aulas: aulasModalidade.length, recebido };
  });

  return (
    <div className="stack">
      <div className="section-heading">
        <div>
          <h2>Relatorios</h2>
          <p>Resumo financeiro por periodo, professor e modalidade.</p>
        </div>
      </div>
      <div className="toolbar">
        <div className="field">
          <label htmlFor="relatorio-inicio">Inicio</label>
          <input id="relatorio-inicio" className="input" type="date" value={dataInicio} onChange={(event) => setDataInicio(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="relatorio-fim">Fim</label>
          <input id="relatorio-fim" className="input" type="date" value={dataFim} onChange={(event) => setDataFim(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="relatorio-modalidade">Modalidade</label>
          <select
            id="relatorio-modalidade"
            className="select"
            value={modalidadeFiltro}
            onChange={(event) => setModalidadeFiltro(event.target.value as Modalidade | "todos")}
          >
            <option value="todos">Todas</option>
            <option value="pilates">Pilates</option>
            <option value="musculacao">Musculacao</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="relatorio-professor">Professor</label>
          <select
            id="relatorio-professor"
            className="select"
            value={professorFiltro}
            onChange={(event) => setProfessorFiltro(event.target.value)}
          >
            <option value="todos">Todos</option>
            {professoresRelatorio.map((professor) => (
              <option key={professor.id} value={professor.id}>
                {professor.nome}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="stats-grid">
        <Metric icon={<CircleDollarSign size={22} />} label="Faturamento total" value={moeda.format(total)} color="blue" />
        <Metric icon={<CalendarClock size={22} />} label="Aulas criadas" value={aulasFiltradas.length} color="green" />
        <Metric icon={<Users size={22} />} label="Professores ativos" value={porProfessor.length} color="violet" />
        <Metric icon={<Coins size={22} />} label="Movimentacoes" value={movimentacoesFiltradas.length} color="amber" />
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Professor</th>
              <th>Aulas</th>
              <th>Recebido em aulas</th>
            </tr>
          </thead>
          <tbody>
            {porProfessor.map((item) => (
              <tr key={item.professor.id}>
                <td>{item.professor.nome}</td>
                <td data-label="Aulas">{item.aulas}</td>
                <td data-label="Recebido">{moeda.format(item.recebido)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Modalidade</th>
              <th>Aulas</th>
              <th>Recebido em aulas</th>
            </tr>
          </thead>
          <tbody>
            {porModalidade.map((item) => (
              <tr key={item.modalidade}>
                <td>{item.modalidade === "pilates" ? "Pilates" : "Musculacao"}</td>
                <td data-label="Aulas">{item.aulas}</td>
                <td data-label="Recebido">{moeda.format(item.recebido)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function HistoricoView(props: { alunos: Aluno[]; usuarios: Usuario[]; movimentacoes: Movimentacao[] }) {
  return (
    <div className="stack">
      <div className="section-heading">
        <div>
          <h2>Historico global</h2>
          <p>Registro de pagamentos e alteracoes de credito.</p>
        </div>
      </div>
      <div className="history-list">
        {props.movimentacoes.map((mov) => {
          const aluno = props.alunos.find((item) => item.id === mov.aluno_id);
          const usuario = props.usuarios.find((item) => item.id === mov.usuario_id);
          const positivo = mov.tipo === "credito_adicionado";
          const quantidadeCreditos = mov.quantidade_creditos ?? 1;
          return (
            <div className={`history-row ${positivo ? "positive" : ""}`} key={mov.id}>
              <div className="history-icon">{positivo ? <Plus size={18} /> : <X size={18} />}</div>
              <div>
                <strong>{aluno?.nome ?? "Aluno removido"}</strong>
                <span>{mov.descricao ?? rotuloTipo(mov.tipo)}</span>
                <small>
                  {formatarDataHora(mov.criado_em)} por {usuario?.nome ?? "usuario desconhecido"}
                </small>
              </div>
              <b>
                {mov.valor_reais
                  ? moeda.format(mov.valor_reais)
                  : `${quantidadeCreditos} ${quantidadeCreditos === 1 ? "credito" : "creditos"}`}
              </b>
            </div>
          );
        })}
        {props.movimentacoes.length === 0 ? <div className="empty">Nenhuma movimentacao registrada ainda.</div> : null}
      </div>
    </div>
  );
}
