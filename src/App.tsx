import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Landing from './pages/Landing.tsx'
import Nac from './pages/Nac.tsx'
import UseCases from './pages/UseCases.tsx'
import ClaudePage from './pages/Claude.tsx'
import Partners from './pages/Partners.tsx'
import Resources from './pages/Resources.tsx'
import Builder from './pages/Builder.tsx'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/nac" element={<Nac />} />
        <Route path="/usecases" element={<UseCases />} />
        <Route path="/claude" element={<ClaudePage />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
