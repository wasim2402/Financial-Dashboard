import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "./components/layout/Layout"
import { Dashboard } from "./pages/Dashboard"
import { Insights } from "./pages/Insights"
import { Transactions } from "./pages/Transactions"
import { GlobalProvider } from "./context/GlobalContext"

function App() {
  return (
    <GlobalProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="insights" element={<Insights />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>
      </Routes>
    </Router>
    </GlobalProvider>
  )
}

export default App
