// src/App.js

import './App.css';
import LandingPage from './pages/LandingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Upload_history from './pages/Upload_history';
import PersonalityInterest from './PersonalityInterest';
import CareerSuggestion from './CareerSuggestion';
import UserDashboard from './pages/UserDashboard';
import AdminApp from './admin/App';

// Import the context providers for the admin panel
import { LoadingProvider } from './admin/globals/LoadingContext';
import { ErrorProvider } from './admin/globals/ErrorContext';
import { AlertProvider } from './admin/globals/AlertContext';

function App() {
  return (
      <Router basename="/icareer">
      <Routes>
        {/* User-facing routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/upload/:userid" element={<Upload_history />} />
        <Route path="/dashboard/:userid/:correlatedId" element={<PersonalityInterest />} />
        <Route path="/dashboard/career/:userid/:correlatedId" element={<CareerSuggestion />} />
        <Route path="/prev-history/:userid" element={<UserDashboard />} />
        <Route path="/logout" element={<LandingPage />} />
        
        {/* Wrap the AdminApp route with its specific context providers */}
        <Route 
          path="/admin/*" 
          element={
            <LoadingProvider>
              <ErrorProvider>
                <AlertProvider>
                  <AdminApp />
                </AlertProvider>
              </ErrorProvider>
            </LoadingProvider>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;