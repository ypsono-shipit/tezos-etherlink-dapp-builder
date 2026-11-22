import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { parseHTML } from 'linkedom'
import App from '../src/App.tsx'

const routes = ['/', '/nac', '/usecases', '/claude', '/partners', '/resources', '/builder']
const dash = /[-–—]/
const routePath = /\/(nac|usecases|claude|partners|resources|builder)\b/

function dashExempt(el: Element | null): boolean {
  return Boolean(el?.closest('pre, code, .mono, [data-technical]'))
}

const failures: string[] = []

for (const route of routes) {
  const html = renderToStaticMarkup(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  )
  if (route === '/' && !html.includes('Apply now')) failures.push('/ missing Apply now')
  if (route === '/' && !html.includes('Open the builder')) failures.push('/ missing Open the builder')
  if (html.includes('Apply at')) failures.push(`${route} still says Apply at`)

  const { document } = parseHTML(`<!doctype html><html><body>${html}</body></html>`)

  const walk = (node: Node) => {
    if (node.nodeType === 3) {
      const text = node.textContent ?? ''
      const parent = (node as Text).parentElement
      if (routePath.test(text)) failures.push(`${route} route path in text: ${text.trim().slice(0, 160)}`)
      if (dash.test(text) && !dashExempt(parent)) failures.push(`${route} dash in text: ${text.trim().slice(0, 160)}`)
      return
    }
    if (node.nodeType !== 1) return
    const el = node as Element
    for (const attr of ['placeholder', 'aria-label', 'alt', 'title']) {
      const value = el.getAttribute(attr)
      if (!value) continue
      if (routePath.test(value)) failures.push(`${route} route path in ${attr}: ${value}`)
      if (dash.test(value) && !dashExempt(el)) failures.push(`${route} dash in ${attr}: ${value}`)
    }
    const pageTitle = el.getAttribute('data-page-title')
    if (pageTitle && (routePath.test(pageTitle) || dash.test(pageTitle))) {
      failures.push(`${route} bad page title: ${pageTitle}`)
    }
    for (const child of Array.from(node.childNodes)) walk(child)
  }
  walk(document.body)
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log('copy check passed')
