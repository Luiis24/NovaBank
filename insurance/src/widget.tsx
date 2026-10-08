// ENTRADA DEL WIDGET AUTÓNOMO. Se compila a un único .js (IIFE) que lleva React adentro
// y funciona en cualquier página HTML, sin el shell ni Module Federation.
import { createRoot, type Root } from 'react-dom/client'
import App, { type InsuranceProps } from './App'
import css from '../../shared/widget-styles.css?inline'

const roots = new WeakMap<Element, Root>()   // recuerda qué raíz de React vive en cada elemento

// Inserta los estilos (una sola vez por página). Así el widget trae su propio CSS.
function injectStyles() {
  if (document.getElementById('nb-widget-styles')) return
  const s = document.createElement('style')
  s.id = 'nb-widget-styles'
  s.textContent = css
  document.head.appendChild(s)
}

/** Monta el widget dentro de `el`. Si ya había uno, lo reemplaza. */
export function mount(el: HTMLElement, props: InsuranceProps = {}) {
  injectStyles()
  unmount(el)
  const root = createRoot(el)
  root.render(<div className="nb-widget"><App {...props} /></div>)
  roots.set(el, root)
}

/** Desmonta el widget y libera memoria. */
export function unmount(el: HTMLElement) {
  roots.get(el)?.unmount()
  roots.delete(el)
}

// Convierte los atributos data-* del elemento en props. "22" -> 22 (número), "COP" -> "COP" (texto).
// Es el equivalente de recibir valores de configuración que la página (p. ej. vía Liquid) escribe en el HTML.
function readProps(el: HTMLElement): Record<string, unknown> {
  const props: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(el.dataset)) {
    if (key === 'nbWidget' || value === undefined) continue
    props[key] = value.trim() !== '' && !isNaN(Number(value)) ? Number(value) : value
  }
  return props
}

/** Busca en la página todos los <div data-nb-widget="insurance"> y monta un widget en cada uno. */
export function autoMount() {
  document.querySelectorAll<HTMLElement>('[data-nb-widget="insurance"]').forEach(el => mount(el, readProps(el) as InsuranceProps))
}

// API pública global: window.NovaBank.insurance.mount(...)
const g = window as any
g.NovaBank = g.NovaBank || {}
g.NovaBank.insurance = { mount, unmount, autoMount }

// Auto-arranque: cuando la página termina de cargar, monta los widgets declarados con data-nb-widget.
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoMount)
else autoMount()
