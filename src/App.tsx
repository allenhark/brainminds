import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import BecomeATutor from './pages/BecomeATutor'
import LoginSignup from './pages/LoginSignup'
import Tutor from './pages/Tutor'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/become-tutor" element={<BecomeATutor />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/tutor/:slug" element={<Tutor />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App