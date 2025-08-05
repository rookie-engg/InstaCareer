import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLoading } from "./globals/LoadingContext";
import { useError } from "./globals/ErrorContext";
import { useAlert } from "./globals/AlertContext";
import HistoryAccordions from "./components/HistoryAccordions";
import { useAuth } from "../components/AuthContext";

export default function UpdateUser() {
    const { userId, userName, userEmail, createdAt, updatedAt } = useParams();
    const { showLoading, hideLoading } = useLoading();
    const { showError } = useError();
    const { showAlert } = useAlert();
    const { token } = useAuth();
    const navigate = useNavigate();

    // ✅ State to manage form inputs
    const [formData, setFormData] = useState({
        name: userName,
        email: userEmail
    });

    // ✅ Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ✅ Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        showLoading();
        try {
            const res = await fetch(`/icareer/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email
                })
            });

            if (!res.ok) {
                throw new Error("Failed to update user.");
            }
            
            showAlert("User updated successfully! ✅");
            // Optionally, redirect back to the admin dashboard after a delay
            setTimeout(() => navigate('/admin'), 1500);

        } catch (err) {
            showError(err.message || "An error occurred during the update.");
        } finally {
            hideLoading();
        }
    };

    return (
        <>
            <Link to="/admin" className="btn btn-primary mb-3">
                <i className="bi bi-arrow-left-circle"></i> Back to All Users
            </Link>

            <div className="card">
                <div className="card-header">
                    <h4>Edit User Details</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 row">
                            <label htmlFor="userId" className="col-sm-2 col-form-label fw-bold">User ID</label>
                            <div className="col-sm-10">
                                <input type="text" readOnly className="form-control-plaintext" id="userId" value={userId} />
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label htmlFor="name" className="col-sm-2 col-form-label fw-bold">Username</label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label htmlFor="email" className="col-sm-2 col-form-label fw-bold">Email</label>
                            <div className="col-sm-10">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label fw-bold">Created At</label>
                            <div className="col-sm-10">
                                <p className="form-control-plaintext">{new Date(createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label fw-bold">Updated At</label>
                            <div className="col-sm-10">
                                <p className="form-control-plaintext">{new Date(updatedAt).toLocaleString()}</p>
                            </div>
                        </div>
                        
                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-success">
                                <i className="bi bi-check-circle"></i> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="mt-4">
                <HistoryAccordions userId={userId} />
            </div>
        </>
    );
}