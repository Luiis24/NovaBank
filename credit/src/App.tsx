import { useMemo, useState } from 'react'

// Configuración del widget. TODO es opcional: si no llega, se usan los valores por defecto.
// Llega de 3 formas: props del host (federado), atributos data-* (widget autónomo) o mount(el, props).
export interface CreditProps {
  monto?: number; meses?: number; tea?: number          // valores iniciales
  montoMin?: number; montoMax?: number; montoPaso?: number // rango del slider de monto
  moneda?: string; locale?: string; titulo?: string       // presentación
}

export default function App({
  monto: monto0 = 20_000_000, meses: meses0 = 36, tea: tea0 = 22,
  montoMin = 1_000_000, montoMax = 100_000_000, montoPaso = 500_000,
  moneda = 'COP', locale = 'es-CO', titulo = 'Simulador de crédito',
}: CreditProps) {
  const fmt = (n: number) => n.toLocaleString(locale, { style: 'currency', currency: moneda, maximumFractionDigits: 0 })
  const [monto, setMonto] = useState(monto0)
  const [meses, setMeses] = useState(meses0)
  const [tea, setTea] = useState(tea0)

  // useMemo: la tabla de amortización solo se recalcula si cambia monto, meses o tea.
  const { cuota, filas, total } = useMemo(() => {
    const r = Math.pow(1 + tea / 100, 1 / 12) - 1                 // TEA -> tasa mensual
    const cuota = (monto * r) / (1 - Math.pow(1 + r, -meses))      // cuota fija (sistema francés)
    let saldo = monto
    const filas = Array.from({ length: meses }, (_, i) => {
      const interes = saldo * r, abono = cuota - interes           // parte interés vs. parte capital
      saldo = Math.max(0, saldo - abono)
      return { n: i + 1, interes, abono, saldo }
    })
    return { cuota, filas, total: cuota * meses }
  }, [monto, meses, tea])

  return (
    <div className="card">
      <h2>{titulo}</h2>
      <p className="muted">Widget React · cálculo en vivo</p>
      <label>Monto: <b>{fmt(monto)}</b>
        <input type="range" min={montoMin} max={montoMax} step={montoPaso} value={monto} onChange={e => setMonto(+e.target.value)} /></label>
      <label>Plazo: <b>{meses} meses</b>
        <input type="range" min={6} max={84} step={6} value={meses} onChange={e => setMeses(+e.target.value)} /></label>
      <label>Tasa efectiva anual: <b>{tea}%</b>
        <input type="range" min={8} max={35} step={0.5} value={tea} onChange={e => setTea(+e.target.value)} /></label>
      <div className="kpis">
        <div><span>Cuota mensual</span><strong>{fmt(cuota)}</strong></div>
        <div><span>Total a pagar</span><strong>{fmt(total)}</strong></div>
        <div><span>Intereses</span><strong>{fmt(total - monto)}</strong></div>
      </div>
      <h3>Tabla de amortización</h3>
      <div style={{ overflowX: 'auto', maxHeight: 260 }}>
        <table><thead><tr><th>#</th><th>Interés</th><th>Abono capital</th><th>Saldo</th></tr></thead>
          <tbody>{filas.map(f => <tr key={f.n}><td>{f.n}</td><td>{fmt(f.interes)}</td><td>{fmt(f.abono)}</td><td>{fmt(f.saldo)}</td></tr>)}</tbody></table>
      </div>
    </div>
  )
}
