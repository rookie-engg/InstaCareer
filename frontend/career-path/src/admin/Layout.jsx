import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLoading } from "./globals/LoadingContext";
import { useError } from "./globals/ErrorContext";
import SideBar from "./components/SideBar";
import { useAuth } from "../components/AuthContext";

// ✅ --- Style block with the new font import and styles ---
const adminStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Playball&family=Poppins:wght@400;500;600&display=swap');

    .admin-wrapper {
        /* Poppins is a clean, geometric font that's highly readable for UI */
        font-family: 'Poppins', sans-serif;
    }

    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #ced4da;
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: #adb5bd;
    }

    /* Dark theme for the sidebar */
    .sidebar-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .sidebar-scrollbar::-webkit-scrollbar-thumb {
        background-color: #495057;
        border-radius: 10px;
    }
    .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: #6c757d;
    }
`;

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-light">
            <div className="container-fluid justify-content-center">
                <h1 className="mb-0 display-6">Welcome Admin! 🥇</h1>
            </div>
        </nav>
    );
}

export default function Layout() {
    const sidebarWidth = '280px';
    const { showLoading, hideLoading, isLoading } = useLoading();
    const { showError } = useError();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { token, setToken } = useAuth();

    useEffect(() => {
        async function fetchUsers() {
            showLoading();
            try {
                const res = await fetch('/icareer/admin/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (!res.ok) throw new Error();
                setUsers(data);
                setFilteredUsers(data);
            } catch {
                showError("Some error Occurred while fetching Data");
            }
            hideLoading();
        }
        fetchUsers();
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        const filtered = query
            ? users.filter(user =>
                user.name.toLowerCase().includes(query.toLowerCase()) ||
                user.email.toLowerCase().includes(query.toLowerCase()) ||
                user.id.toLowerCase().includes(query.toLowerCase())
            )
            : users;
        setFilteredUsers(filtered);
    };

    return (
        // ✅ --- Added "admin-wrapper" className here ---
        <div className="d-flex admin-wrapper">
            <style>{adminStyles}</style>
            <SideBar
                width={sidebarWidth}
                users={filteredUsers}
                onSearch={handleSearch}
                searchQuery={searchQuery}
            />

            <div
                style={{
                    marginLeft: sidebarWidth,
                    width: `calc(100% - ${sidebarWidth})`,
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Navbar />
                <div className="p-4 flex-grow-1 bg-light custom-scrollbar" style={{ overflowY: 'auto' }}>
                    <hr />
                    <Outlet context={{ users: filteredUsers, setUsers: setFilteredUsers, isLoading }} />
                </div>
            </div>
        </div>
    );
}