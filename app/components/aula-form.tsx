import type { FormEvent } from "react";
import { CalendarCheck } from "lucide-react";
import type { Modalidade, Usuario } from "../types";

export function AulaForm(props: {
  modalidade: Modalidade;
  horario: string;
  data?: string;
  professorId?: string;
  professores?: Usuario[];
  compact?: boolean;
  onModalidadeChange: (valor: Modalidade) => void;
  onHorarioChange: (valor: string) => void;
  onDataChange?: (valor: string) => void;
  onProfessorChange?: (valor: string) => void;
  onAbrirAula: (event?: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className={props.compact ? "lesson-form compact" : "lesson-form"} onSubmit={props.onAbrirAula}>
      <div className="field">
        <span className="field-label">Modalidade</span>
        <div className="lesson-mode" role="group" aria-label="Modalidade">
          <button
            className={props.modalidade === "pilates" ? "active" : ""}
            type="button"
            onClick={() => props.onModalidadeChange("pilates")}
          >
            Pilates
          </button>
          <button
            className={props.modalidade === "musculacao" ? "active" : ""}
            type="button"
            onClick={() => props.onModalidadeChange("musculacao")}
          >
            Musculacao
          </button>
        </div>
      </div>
      <div className="field">
        <label htmlFor="horario">Horario</label>
        <input
          id="horario"
          className="input"
          type="time"
          value={props.horario}
          onChange={(event) => props.onHorarioChange(event.target.value)}
        />
      </div>
      {props.data !== undefined ? (
        <div className="field">
          <label htmlFor="data-aula">Data</label>
          <input
            id="data-aula"
            className="input"
            type="date"
            value={props.data}
            onChange={(event) => props.onDataChange?.(event.target.value)}
          />
        </div>
      ) : null}
      {props.professores ? (
        <div className="field">
          <label htmlFor="professor-aula">Professor</label>
          <select
            id="professor-aula"
            className="select"
            value={props.professorId ?? ""}
            onChange={(event) => props.onProfessorChange?.(event.target.value)}
          >
            <option value="">Selecione</option>
            {props.professores.map((professor) => (
              <option key={professor.id} value={professor.id}>
                {professor.nome}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <button className="btn primary xl" type="submit">
        <CalendarCheck size={19} />
        Iniciar aula
      </button>
    </form>
  );
}
