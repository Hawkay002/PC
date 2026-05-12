import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreationPage from './pages/CreationPage';
import SharedPostcard from './pages/SharedPostcard';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-obsidian font-sans text-luminary">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<CreationPage />} />
          <Route path="/card/:id" element={<SharedPostcard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
