import React, { Component, Suspense, lazy, useEffect, useState, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

// Los remotes se descargan SOLO cuando el usuario abre su pestaña (carga lazy vía Module Federation).
const Credit = lazy(() => import('credit/App'))
const Insurance = lazy(() => import('insurance/App'))

type Tab = 'home' | 'credit' | 'insurance'
type Content = {
  banners: { t: string; d: string; tab: Tab }[]
  faq: [string, string][]
  widgets: { credit: Record<string, unknown>; insurance: Record<string, unknown> }
}

// Contenido del portal: se pide por HTTP a un JSON (simula un CMS). Maneja carga y error.
function useContent() {
  const [data, setData] = useState<Content | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}api/portal-content.json`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(setData)
      .catch(e => setError(String(e.message || e)))
  }, [])
  return { data, error }
}

// Si un widget remoto falla al cargar, solo cae ese widget y no todo el portal.
class WidgetBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed
      ? <div className="card"><h3>No pudimos cargar este widget</h3><p className="muted">Intenta recargar la página.</p></div>
      : this.props.children
  }
}

function Shell() {
  const [tab, setTab] = useState<Tab>('home')
  const { data, error } = useContent()
  return (<>
    <header><div className="wrap nav"><b className="logo">◆ NovaBank</b>
      <nav>{([['home', 'Inicio'], ['credit', 'Crédito'], ['insurance', 'Seguros']] as [Tab, string][]).map(([k, l]) =>
        <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}</nav></div></header>
    <main className="wrap">
      {tab === 'home' && <>
        <section className="hero"><h1>Tu banco, <span>sin fricción</span>.</h1>
          <p>Portal digital con micro frontends: un shell que carga widgets independientes en runtime.</p>
          <p><a className="link" href="widget-demo.html">Ver los widgets funcionando solos en una página común →</a></p></section>
        {error && <div className="card"><h3>No se pudo cargar el contenido</h3><p className="muted">{error}</p></div>}
        {!data && !error && <p className="muted">Cargando contenido…</p>}
        {data && <>
          <div className="grid">{data.banners.map(b => <div className="card promo" key={b.t}>
            <h3>{b.t}</h3><p className="muted">{b.d}</p><button className="btn" onClick={() => setTab(b.tab)}>Ir ahora →</button></div>)}</div>
          <h2>Arquitectura</h2>
          <div className="arch"><div className="box host">Shell (host)<small>React + Vite</small></div>
            <div className="lines">⇣ Module Federation ⇣</div>
            <div className="row"><div className="box">Remote: Crédito<small>React + TS</small></div><div className="box">Remote: Seguros<small>React + TS</small></div></div></div>
          <h2>Preguntas frecuentes</h2>
          {data.faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p className="muted">{a}</p></details>)}
        </>}
      </>}
      <WidgetBoundary key={tab}><Suspense fallback={<p className="muted">Cargando widget…</p>}>
        {/* La configuración de cada widget viene del JSON de contenido y se pasa como props */}
        {tab === 'credit' && <Credit {...(data?.widgets.credit ?? {})} />}
        {tab === 'insurance' && <Insurance {...(data?.widgets.insurance ?? {})} />}
      </Suspense></WidgetBoundary>
    </main>
    <footer className="wrap muted">Proyecto de portafolio · Luis Morales · Sin datos reales</footer></>)
}
createRoot(document.getElementById('root')!).render(<Shell />)
