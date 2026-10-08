import { useState } from 'react'

// Configuración opcional (mismas 3 vías de entrada que el widget de crédito).
export interface InsuranceProps {
  tipo?: 'vida' | 'auto'; plan?: 'basico' | 'plus'; edad?: number; valor?: number
  valorMin?: number; valorMax?: number; valorPaso?: number
  moneda?: string; locale?: string; titulo?: string
}

export default function App({
  tipo: tipo0 = 'vida', plan: plan0 = 'basico', edad: edad0 = 30, valor: valor0 = 50_000_000,
  valorMin = 10_000_000, valorMax = 300_000_000, valorPaso = 5_000_000,
  moneda = 'COP', locale = 'es-CO', titulo = 'Cotizador de seguros',
}: InsuranceProps) {
  const fmt = (n: number) => n.toLocaleString(locale, { style: 'currency', currency: moneda, maximumFractionDigits: 0 })
  const [paso, setPaso] = useState(1)          // paso actual del formulario (1..3)
  const [tipo, setTipo] = useState(tipo0)
  const [edad, setEdad] = useState(edad0)
  const [valor, setValor] = useState(valor0)
  const [plan, setPlan] = useState(plan0)

  // Fórmula FICTICIA, solo demostrativa.
  const base = tipo === 'vida' ? valor * 0.0012 * (1 + (edad - 18) / 60) : valor * 0.025 * (edad < 25 ? 1.3 : 1)
  const prima = (plan === 'plus' ? base * 1.35 : base) / 12

  return (
    <div className="card">
      <h2>{titulo}</h2>
      <p className="muted">Widget React · formulario por pasos ({paso}/3)</p>
      <div className="steps">{[1, 2, 3].map(n => <i key={n} className={n <= paso ? 'on' : ''} />)}</div>
      {paso === 1 && <div>
        <h3>¿Qué quieres asegurar?</h3>
        <div className="row">
          {(['vida', 'auto'] as const).map(t => <button key={t} className={tipo === t ? 'btn' : 'btn ghost'} onClick={() => setTipo(t)}>{t === 'vida' ? 'Seguro de vida' : 'Seguro de auto'}</button>)}
        </div></div>}
      {paso === 2 && <div>
        <label>Edad: <b>{edad}</b><input type="range" min={18} max={75} value={edad} onChange={e => setEdad(+e.target.value)} /></label>
        <label>{tipo === 'vida' ? 'Valor asegurado' : 'Valor del vehículo'}: <b>{fmt(valor)}</b>
          <input type="range" min={valorMin} max={valorMax} step={valorPaso} value={valor} onChange={e => setValor(+e.target.value)} /></label>
        <div className="row">{(['basico', 'plus'] as const).map(p => <button key={p} className={plan === p ? 'btn' : 'btn ghost'} onClick={() => setPlan(p)}>{p === 'basico' ? 'Plan Básico' : 'Plan Plus'}</button>)}</div></div>}
      {paso === 3 && <div className="kpis"><div><span>Tu prima estimada</span><strong>{fmt(prima)}/mes</strong></div>
        <div><span>Producto</span><strong>{tipo === 'vida' ? 'Vida' : 'Auto'} {plan}</strong></div></div>}
      <div className="row" style={{ marginTop: 16 }}>
        {paso > 1 && <button className="btn ghost" onClick={() => setPaso(paso - 1)}>Atrás</button>}
        {paso < 3 && <button className="btn" onClick={() => setPaso(paso + 1)}>Siguiente</button>}
      </div>
    </div>
  )
}
