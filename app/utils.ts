import type { FormaPagamento, MovimentacaoTipo } from "./types";

export const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function criarId(prefixo: string) {
  return `${prefixo}_${Math.random().toString(36).slice(2, 9)}`;
}

export function agora() {
  return new Date().toISOString();
}

export function proximoHorarioRedondo(data = new Date()) {
  const arredondado = new Date(data);
  const minutos = arredondado.getMinutes();
  const incremento = minutos === 0 || minutos === 30 ? 0 : minutos < 30 ? 30 - minutos : 60 - minutos;

  arredondado.setMinutes(minutos + incremento, 0, 0);

  return `${String(arredondado.getHours()).padStart(2, "0")}:${String(
    arredondado.getMinutes(),
  ).padStart(2, "0")}`;
}

export function formatarData(valor: string) {
  const [ano, mes, dia] = valor.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function formatarDataHora(valor: string) {
  const data = new Date(valor);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}

export function rotuloTipo(tipo: MovimentacaoTipo) {
  const labels: Record<MovimentacaoTipo, string> = {
    credito_adicionado: "Credito adicionado",
    credito_removido: "Credito removido",
    credito_usado: "Credito usado",
    avulso_pix: "Avulso PIX",
    avulso_dinheiro: "Avulso dinheiro",
  };
  return labels[tipo];
}

export function rotuloPagamento(forma: FormaPagamento) {
  const labels: Record<FormaPagamento, string> = {
    credito: "Credito",
    pix: "PIX",
    dinheiro: "Dinheiro",
  };
  return labels[forma];
}
