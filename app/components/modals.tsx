import { Check, Coins, X } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import type { Aluno, Usuario } from "../types";

export function CadastroAlunoModal(props: {
  onClose: () => void;
  onSubmit: (nome: string, telefone: string, cpf: string, creditos: number) => void;
}) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [creditos, setCreditos] = useState(0);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!nome.trim()) return;
    props.onSubmit(nome.trim(), telefone.trim(), cpf.trim(), creditos);
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <form className="modal stack" onSubmit={submit}>
        <h2>Novo aluno</h2>
        <div className="field">
          <label htmlFor="novo-nome">Nome</label>
          <input id="novo-nome" className="input" value={nome} onChange={(event) => setNome(event.target.value)} autoFocus />
        </div>
        <div className="field">
          <label htmlFor="novo-telefone">Telefone</label>
          <input
            id="novo-telefone"
            className="input"
            value={telefone}
            placeholder="Opcional"
            onChange={(event) => setTelefone(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="novo-cpf">CPF</label>
          <input
            id="novo-cpf"
            className="input"
            value={cpf}
            placeholder="Opcional"
            onChange={(event) => setCpf(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="credito-inicial">Creditos iniciais</label>
          <input
            id="credito-inicial"
            className="input"
            type="number"
            min={0}
            value={creditos}
            onChange={(event) => setCreditos(Number(event.target.value))}
          />
        </div>
        <div className="button-row">
          <button className="btn primary" type="submit">
            <Check size={18} />
            Salvar
          </button>
          <button className="btn ghost" type="button" onClick={props.onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export function AlunoModal(props: {
  aluno: Aluno;
  onClose: () => void;
  onSubmit: (dados: { nome: string; telefone: string; cpf: string; ativo: boolean }) => void;
}) {
  const [nome, setNome] = useState(props.aluno.nome);
  const [telefone, setTelefone] = useState(props.aluno.telefone ?? "");
  const [cpf, setCpf] = useState(props.aluno.cpf ?? "");
  const [ativo, setAtivo] = useState(props.aluno.ativo);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!nome.trim()) return;
    props.onSubmit({
      nome: nome.trim(),
      telefone: telefone.trim(),
      cpf: cpf.trim(),
      ativo,
    });
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <form className="modal stack" onSubmit={submit}>
        <h2>Editar aluno</h2>
        <div className="field">
          <label htmlFor="aluno-nome">Nome</label>
          <input
            id="aluno-nome"
            className="input"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="aluno-telefone">Telefone</label>
          <input
            id="aluno-telefone"
            className="input"
            value={telefone}
            placeholder="Opcional"
            onChange={(event) => setTelefone(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="aluno-cpf">CPF</label>
          <input
            id="aluno-cpf"
            className="input"
            value={cpf}
            placeholder="Opcional"
            onChange={(event) => setCpf(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="aluno-status">Status</label>
          <select
            id="aluno-status"
            className="select"
            value={ativo ? "ativo" : "inativo"}
            onChange={(event) => setAtivo(event.target.value === "ativo")}
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
        <div className="button-row">
          <button className="btn primary" type="submit">
            <Check size={18} />
            Salvar
          </button>
          <button className="btn ghost" type="button" onClick={props.onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export function CreditoModal(props: {
  aluno: Aluno;
  onClose: () => void;
  onSubmit: (quantidade: number, forma: "pix" | "dinheiro") => void;
}) {
  const [quantidade, setQuantidade] = useState(4);
  const [forma, setForma] = useState<"pix" | "dinheiro">("pix");

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <form
        className="modal stack"
        onSubmit={(event) => {
          event.preventDefault();
          props.onSubmit(quantidade, forma);
        }}
      >
        <h2>Adicionar creditos</h2>
        <p className="muted">
          {props.aluno.nome} tem {props.aluno.saldo_creditos} creditos.
        </p>
        <div className="field">
          <label htmlFor="creditos">Quantidade</label>
          <input
            id="creditos"
            className="input"
            type="number"
            min={1}
            value={quantidade}
            onChange={(event) => setQuantidade(Number(event.target.value))}
          />
        </div>
        <div className="field">
          <label htmlFor="forma-pagamento">Forma de pagamento</label>
          <select
            id="forma-pagamento"
            className="select"
            value={forma}
            onChange={(event) => setForma(event.target.value as "pix" | "dinheiro")}
          >
            <option value="pix">PIX</option>
            <option value="dinheiro">Dinheiro</option>
          </select>
        </div>
        <div className="button-row">
          <button className="btn primary" type="submit">
            <Coins size={18} />
            Adicionar
          </button>
          <button className="btn ghost" type="button" onClick={props.onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export function RemoverCreditoModal(props: {
  aluno: Aluno;
  onClose: () => void;
  onSubmit: (quantidade: number, motivo: string) => void;
}) {
  const [quantidade, setQuantidade] = useState(1);
  const [motivo, setMotivo] = useState("");
  const quantidadeValida = quantidade > 0 && quantidade <= props.aluno.saldo_creditos;
  const motivoValido = motivo.trim().length > 0;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!quantidadeValida || !motivoValido) return;
    props.onSubmit(quantidade, motivo.trim());
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <form className="modal stack" onSubmit={submit}>
        <h2>Remover creditos</h2>
        <p className="muted">
          {props.aluno.nome} tem {props.aluno.saldo_creditos} creditos.
        </p>
        <div className="field">
          <label htmlFor="creditos-remover">Quantidade</label>
          <input
            id="creditos-remover"
            className="input"
            type="number"
            min={1}
            max={props.aluno.saldo_creditos}
            value={quantidade}
            onChange={(event) => setQuantidade(Number(event.target.value))}
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="motivo-remocao">Motivo</label>
          <input
            id="motivo-remocao"
            className="input"
            value={motivo}
            placeholder="Ex: ajuste de saldo"
            onChange={(event) => setMotivo(event.target.value)}
          />
        </div>
        <div className="button-row">
          <button className="btn rose" type="submit" disabled={!quantidadeValida || !motivoValido}>
            <X size={18} />
            Remover
          </button>
          <button className="btn ghost" type="button" onClick={props.onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export function ProfessorModal(props: {
  professor?: Usuario;
  onClose: () => void;
  onSubmit: (dados: { nome: string; telefone: string; cpf: string; ativo: boolean }) => void;
}) {
  const [nome, setNome] = useState(props.professor?.nome ?? "");
  const [telefone, setTelefone] = useState(props.professor?.telefone ?? "");
  const [cpf, setCpf] = useState(props.professor?.cpf ?? "");
  const [ativo, setAtivo] = useState(props.professor?.ativo ?? true);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!nome.trim()) return;
    props.onSubmit({
      nome: nome.trim(),
      telefone: telefone.trim(),
      cpf: cpf.trim(),
      ativo,
    });
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <form className="modal stack" onSubmit={submit}>
        <h2>{props.professor ? "Editar professor" : "Novo professor"}</h2>
        <div className="field">
          <label htmlFor="professor-nome">Nome</label>
          <input
            id="professor-nome"
            className="input"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="professor-telefone">Telefone</label>
          <input
            id="professor-telefone"
            className="input"
            value={telefone}
            placeholder="Opcional"
            onChange={(event) => setTelefone(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="professor-cpf">CPF</label>
          <input
            id="professor-cpf"
            className="input"
            value={cpf}
            placeholder="Opcional"
            onChange={(event) => setCpf(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="professor-status">Status</label>
          <select
            id="professor-status"
            className="select"
            value={ativo ? "ativo" : "inativo"}
            onChange={(event) => setAtivo(event.target.value === "ativo")}
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
        <div className="button-row">
          <button className="btn primary" type="submit">
            <Check size={18} />
            Salvar
          </button>
          <button className="btn ghost" type="button" onClick={props.onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
