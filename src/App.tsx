import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Landing from './pages/Landing.tsx'
import Nac from './pages/Nac.tsx'
import UseCases from './pages/UseCases.tsx'
import BoundlessPage from './pages/Boundless.tsx'
import Partners from './pages/Partners.tsx'
import Resources from './pages/Resources.tsx'
import Builder from './pages/Builder.tsx'

function LegacyClaudeRedirect() {
  const { search, hash } = useLocation()
  return <Navigate to={{ pathname: '/boundless', search, hash }} replace />
}

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
        <Route path="/boundless" element={<BoundlessPage />} />
        <Route path="/claude" element={<LegacyClaudeRedirect />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
