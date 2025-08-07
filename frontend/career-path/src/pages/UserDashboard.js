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
        const res = await fetch(`/icareer/api/history/${userid}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error("Failed to fetch history");
        }
        const data = await res.json();
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch user history:", error);
      } finally {
        setIsLoaded(true);
      }
    }

    if (token) {
        fetchHistory();
    }
  }, [userid, token]);

  const deleteItem = async (id) => {
    try {
      // ✅ FIX: Changed the endpoint from /admin/history to /api/history
      const res = await fetch(`/icareer/api/history/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        // If deletion is successful, update the UI by filtering out the deleted item
        setHistory(history.filter(item => item.id !== id));
      } else {
        // Log an error if the server response is not OK
        console.error("Failed to delete history item. Status:", res.status);
        alert("Error: You do not have permission to delete this item.");
      }
    } catch (error) {
      console.error("An error occurred during deletion:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="container py-5" style={{ background: 'linear-gradient(to right, #f2f2f2, #e0eafc)', minHeight: '100vh', fontFamily: '"Dancing Script", cursive, sans-serif' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ background: 'linear-gradient(to right, #6a11cb, #2575fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📁 Your Upload History</h2>
        <div className="d-flex justify-content-between align-items-center mb-4 gap-2">
          <button className="btn btn-primary mt-3 rounded-pill px-4 py-2" onClick={() => navigate(`/upload/${userid}`)}>⬆️ Upload New</button>
          <button className="btn btn-danger mt-3 rounded-pill px-4 py-2" onClick={() => {
            setToken(null);
            navigate('/logout');
          }}><i className="bi bi-box-arrow-right"></i> Logout</button>
        </div>
      </div>

      {isLoaded && history.length > 0 ? (
        <Accordion defaultActiveKey="0" className="shadow rounded overflow-hidden">
          {history.map((item, index) => (
            <Accordion.Item eventKey={index.toString()} key={item.id}>
              <Accordion.Header style={{ background: 'linear-gradient(to right, #c9d6ff, #e2e2e2)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                <span style={{ color: '#2c3e50' }}>{item.zipFileName}</span>
              </Accordion.Header>
              <Accordion.Body style={{ background: 'linear-gradient(to right, #ffffff, #f0f2f5)', fontSize: '1rem', color: '#2d3436' }}>
                <p className="mb-2">
                  <strong>📅 Uploaded At:</strong> {new Date(item.requestTimestamp).toLocaleString()}
                </p>
                <p className="mb-2">
                  <strong>⏳ Status:</strong> {item.status}
                </p>
                <p className="mb-2">
                  <strong>📁 Zip File Path:</strong> {item.zipFilePath}
                </p>

                {item.userResponse && (
                  <div className="mt-3">
                    <h6>📄 User Response Details:</h6>
                    <p className="mb-1">
                      <strong>ID:</strong> {item.userResponse.id}
                    </p>
                    <p className="mb-1">
                      <strong>Response Timestamp:</strong> {new Date(item.userResponse.responseTimestamp).toLocaleString()}
                    </p>
                  </div>
                )}

                {item.status === 'COMPLETED' &&
                  <div className="d-flex justify-content-end gap-3 mt-3">
                    <button className="btn btn-outline-success rounded-pill px-3 py-1" onClick={() => navigate(`/dashboard/${userid}/${item.id}`)}>
                      🔍 Personality Insights
                    </button>
                    <button className="btn btn-outline-success rounded-pill px-3 py-1" onClick={() => navigate(`/dashboard/career/${userid}/${item.id}`)}>
                      🔍 Career Insights
                    </button>
                    <button className="btn btn-outline-danger rounded-pill px-3 py-1" onClick={() => deleteItem(item.id)}>
                      🗑 Delete
                    </button>
                  </div>}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : isLoaded ? (
        <div className="text-center mt-5">
          <h4 style={{ color: '#6a0572', fontWeight: '600' }}>👋 Welcome, new user!</h4>
          <p className="text-muted">You haven’t uploaded anything yet. Start exploring your career insights by uploading your first ZIP file.</p>
          <button className="btn btn-primary mt-3 rounded-pill px-4 py-2" onClick={() => navigate(`/upload/${userid}`)}>⬆️ Upload Now</button>
        </div>
      ) : (
        <div className="text-center text-muted">Loading...</div>
      )}
    </div>
  );
};

export default UserDashboard;