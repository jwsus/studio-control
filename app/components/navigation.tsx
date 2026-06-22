import type { Aba, NavItem, Usuario } from "../types";

export function AppHeader(props: {
  aulaStatus: string;
  usuarios: Usuario[];
  usuarioAtual: Usuario;
  onUsuarioChange: (id: string) => void;
  brandIcon: React.ReactNode;
}) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-mark">{props.brandIcon}</div>
        <div>
          <h1>Estudio Control</h1>
          <p>Frequencia, aulas e creditos</p>
        </div>
      </div>
      <div className="header-actions">
        <span className="status-pill">
          <span />
          {props.aulaStatus}
        </span>
        <label className="role-switch">
          Perfil
          <select value={props.usuarioAtual.id} onChange={(event) => props.onUsuarioChange(event.target.value)}>
            {props.usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.perfil === "admin" ? "Admin" : "Professor"} - {usuario.nome}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
}

export function Sidebar(props: {
  items: NavItem[];
  abaAtiva: Aba;
  onChange: (aba: Aba) => void;
}) {
  return (
    <aside className="sidebar">
      {props.items.map((item) => (
        <button
          className={`nav-button ${props.abaAtiva === item.aba ? "active" : ""}`}
          data-aba={item.aba}
          key={item.aba}
          type="button"
          onClick={() => props.onChange(item.aba)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
}
