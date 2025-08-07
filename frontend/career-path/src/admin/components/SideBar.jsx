// src/admin/components/SideBar.jsx

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext"; // Import useAuth

export default function SideBar({ width, users, onSearch, searchQuery }) {
    const navigate = useNavigate();
    const { setToken } = useAuth(); // Get setToken from our AuthContext

    const handleLogout = () => {
        setToken(null);      // This will clear the token from localStorage and state
        navigate('/');  // Redirect user to the login page
    };

    return (
        <div
            className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
            style={{ width, height: '100vh', position: 'fixed' }}
        >
            {/* ✅ FIX: Replaced Link with a button and added an onClick handler */}
            <button
                onClick={handleLogout}
                className="btn btn-danger w-100"
            >
                Logout <i className="bi bi-box-arrow-left"></i>
            </button>

            <hr />
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name, email, or ID"
                    value={searchQuery}
                    onChange={onSearch}
                />
            </div>
            <div className="custom-scrollbar sidebar-scrollbar" style={{ overflowY: 'auto', flex: 1 }}>
                <ul className="nav nav-pills flex-column">
                    {users.map((user) => (
                        <li key={user.id} className="nav-item">
                            <hr />
                            <a href="#" className="nav-link text-white" onClick={() => navigate(`/admin/update/user/${user.id}/${user.name}/${user.email}/${user.createdAt}/${user.updatedAt}`)}>
                                <div className="d-flex flex-column">
                                    <span className="fs-6 fw-bold">{user.name}</span>
                                    <small className="text-secondary">{user.id}</small>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}