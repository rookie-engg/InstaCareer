import './App.css';
import LandingPage from './pages/LandingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Upload_history from './pages/Upload_history';
import PersonalityInterest from './PersonalityInterest';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/upload" element={<Upload_history />} />
        <Route path="/dashboard/:correlatedId" element={<PersonalityInterest />} />
      </Routes>
    </Router>
  );
}

export default App;
