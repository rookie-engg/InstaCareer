import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import UpdateUser from './UpdateUser';
import AllUsers from './pages/AllUsers';
import PersonalityInterest from './components/PersonalityInterest';
import CareerSuggestion from './components/CareerSuggestion';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AllUsers />} /> {/* Set AllUsers as the default admin page */}
        <Route path="update/user/:userId/:userName/:userEmail/:createdAt/:updatedAt" element={<UpdateUser />} />
        
        {/* Routes for dashboard components */}
        <Route path="dashboard/personality/:correlatedId" element={<PersonalityInterest />} />
        <Route path="dashboard/career/:correlatedId" element={<CareerSuggestion />} />
      </Route>
    </Routes>
  );
}

export default App;