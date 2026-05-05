import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreationPage from './pages/CreationPage';
import SharedPostcard from './pages/SharedPostcard';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-pastel-blue/20 font-sans text-ink selection:bg-pastel-yellow">
        <Routes>
          <Route path="/" element={<CreationPage />} />
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
