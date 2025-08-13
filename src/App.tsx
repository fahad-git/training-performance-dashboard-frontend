import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { UnderConstruction } from './components/UnderConstruction';
import { Footer } from './components/Footer';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial app loading and show loader
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 700);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard isLoading={isLoading} />} />
          <Route path="/analytics" element={<UnderConstruction pageName="Analytics" />} />
          <Route path="/reports" element={<UnderConstruction pageName="Reports" />} />
          <Route path="/settings" element={<UnderConstruction pageName="Settings" />} />
          <Route path="/users" element={<UnderConstruction pageName="User Management" />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;