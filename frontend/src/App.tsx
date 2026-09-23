import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { WelcomePage } from './pages/WelcomePage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome/:userId" element={<WelcomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
