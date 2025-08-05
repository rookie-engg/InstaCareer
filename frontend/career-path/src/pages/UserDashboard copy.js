import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion } from 'react-bootstrap';
import { useAuth } from '../components/AuthContext';

const UserDashboard = () => {
  const { userid } = useParams();
  const [history, setHistory] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const { token, setToken } = useAuth();

  useEffect(() => {

    async function fetchHistory() {
      try {
        const res = await fetch(`/icareer/admin/history/${userid}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        console.log(data)
        setHistory(data);
      } catch (error) {
        alert(error);
      }
    }
    fetchHistory().then(() => {
      setIsLoaded(true);
    });

  }, [userid]);

  const deleteItem = (id) => {
    setHistory(history.filter(item => item.id !== id));
  };

  const goToInsights = (item) => {
    navigate(`/personality-insights/${item.id}`);
  };

  return (
    <div className="container py-5" style={{ background: 'linear-gradient(to right, #f2f2f2, #e0eafc)', minHeight: '100vh', fontFamily: '"Dancing Script", cursive, sans-serif' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ background: 'linear-gradient(to right, #6a11cb, #2575fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📁 Your Upload History</h2>
      </div>

      {isLoaded && history.length > 0 ? (
        <Accordion defaultActiveKey="0" className="shadow rounded overflow-hidden">
          {history.map((item, index) => (
            <Accordion.Item eventKey={index.toString()} key={item.id}>
              <Accordion.Header style={{ background: 'linear-gradient(to right, #c9d6ff, #e2e2e2)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                <span style={{ color: '#2c3e50' }}>{item.fileName}</span>
              </Accordion.Header>
              <Accordion.Body style={{ background: 'linear-gradient(to right, #ffffff, #f0f2f5)', fontSize: '1rem', color: '#2d3436' }}>
                <p className="mb-2">
                  <strong>📅 Uploaded At:</strong> {new Date(item.uploadedAt).toLocaleString()}
                </p>
                <div className="d-flex justify-content-end gap-3 mt-3">
                  <button className="btn btn-outline-success rounded-pill px-3 py-1" onClick={() => goToInsights(item.id)}>
                    🔍 View Insights
                  </button>
                  <button className="btn btn-outline-danger rounded-pill px-3 py-1" onClick={() => deleteItem(item.id)}>
                    🗑 Delete
                  </button>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : isLoaded ? (
        <div className="text-center mt-5">
          <h4 style={{ color: '#6a0572', fontWeight: '600' }}>👋 Welcome, new user!</h4>
          <p className="text-muted">You haven’t uploaded anything yet. Start exploring your career insights by uploading your first ZIP file.</p>
          <button className="btn btn-primary mt-3 rounded-pill px-4 py-2" onClick={() => navigate('/upload')}>⬆️ Upload Now</button>
        </div>
      ) : (
        <div className="text-center text-muted">Loading...</div>
      )}
    </div>
  );
};

export default UserDashboard;
