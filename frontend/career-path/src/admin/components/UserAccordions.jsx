import { useState } from "react";
import { useLoading } from "../globals/LoadingContext";
import { useError } from "../globals/ErrorContext";
import { useAlert } from '../globals/AlertContext';
import HistoryAccordions from './HistoryAccordions';
import '../assests/style.css';
import { useAuth } from "../../components/AuthContext";

function UserAccordion({ user, accordionId, accordionParent, onDelete, onUpdate }) {
    // Destructure all properties from the user object
    const { id, name, email, createdAt, updatedAt } = user;
    
    const { showLoading, hideLoading } = useLoading();
    const { showError } = useError();
    const { showAlert } = useAlert();
    const { token } = useAuth();
    const offCanvasId = "UpdateOffcanvas-" + id;

    // State to manage the form inputs, initialized with current user data
    const [formData, setFormData] = useState({
        name: name,
        email: email,
    });

    // Handle changes in the form inputs
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        showLoading();
        try {
            const res = await fetch(`/icareer/admin/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Update failed");
            }

            const updatedUser = await res.json();
            onUpdate(updatedUser); // Refresh the list with the new data
            showAlert("User updated successfully! ✅");

        } catch (err) {
            showError(err.message);
        } finally {
            hideLoading();
        }
    };

    return (
        <div key={"item" + accordionId} className="accordion-item">
            <h2 className="accordion-header d-flex justify-content-between align-items-center px-3">
                {/* Accordion Toggle Button with all user details restored */}
                <button
                    className={`accordion-button collapsed flex-grow-1`}
                    type="button" data-bs-toggle="collapse" data-bs-target={`#${accordionId}`}
                    aria-expanded={false} aria-controls={accordionId}
                >
                    <div className="w-100">
                        <div className="fw-bold text-secondary">User ID: <span className="text-dark">{id}</span></div>
                        <div className="fw-bold text-secondary">User Name: <span className="text-dark">{name}</span></div>
                        <div className="fw-bold text-secondary">User Email: <span className="text-dark">{email}</span></div>
                        <div className="fw-bold text-secondary">Created At: <span className="text-dark">{new Date(createdAt).toLocaleString()}</span></div>
                        <div className="fw-bold text-secondary">Updated At: <span className="text-dark">{new Date(updatedAt).toLocaleString()}</span></div>
                    </div>
                </button>

                {/* Action Buttons */}
                <div className="ms-2">
                    <button className="btn btn-sm btn-danger w-100" onClick={onDelete}>
                        <i className="bi bi-person-x"></i> Delete
                    </button>
                    <button className="btn btn-sm btn-info w-100 mt-1" type="button" data-bs-toggle="offcanvas" data-bs-target={`#${offCanvasId}`} aria-controls={offCanvasId}>
                        <i className="bi bi-pen"></i> Update
                    </button>
                </div>
            </h2>

            <div id={accordionId} className={`accordion-collapse collapse`} data-bs-parent={`#${accordionParent}`}>
                <div className="accordion-body">
                    <HistoryAccordions userId={id} />
                </div>
            </div>

            {/* Offcanvas Form with all fields and correct functionality */}
            <div className="offcanvas offcanvas-top" tabIndex="-1" id={offCanvasId} aria-labelledby={`${offCanvasId}Label`}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id={`${offCanvasId}Label`}>Update User</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <form className="offcanvas-body fs-5" onSubmit={handleSubmit}>
                    <div className="mb-3 row">
                        <label className="col-sm-2 col-form-label fw-bold">UserID</label>
                        <div className="col-sm-10">
                            <input type="text" readOnly className="form-control-plaintext" value={id} />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor={`inputUsername-${id}`} className="col-sm-2 col-form-label fw-bold">Username</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                id={`inputUsername-${id}`}
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor={`inputEmail-${id}`} className="col-sm-2 col-form-label fw-bold">Email</label>
                        <div className="col-sm-10">
                            <input
                                type="email"
                                className="form-control"
                                id={`inputEmail-${id}`}
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    {/* Restored Created At and Updated At fields */}
                    <div className="mb-3 row">
                        <label className="col-sm-2 col-form-label fw-bold">Created At</label>
                        <div className="col-sm-10">
                            <input type="text" readOnly className="form-control-plaintext" value={new Date(createdAt).toLocaleString()} />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label className="col-sm-2 col-form-label fw-bold">Updated At</label>
                        <div className="col-sm-10">
                            <input type="text" readOnly className="form-control-plaintext" value={new Date(updatedAt).toLocaleString()} />
                        </div>
                    </div>
                    <div className="w-100 d-flex flex-row-reverse">
                        <button type="submit" className="btn btn-success" data-bs-dismiss="offcanvas">
                            <i className="bi bi-bookmark-check"></i> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function UserAccordions({ users, setUsers }) {
    const { showLoading, hideLoading } = useLoading();
    const { showError } = useError();
    const { showAlert } = useAlert();
    const { token } = useAuth();
    const accordionParent = "userAccordionParent";

    const handleDelete = async (userId) => {
        showLoading();
        try {
            const res = await fetch(`/icareer/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Deletion failed");
            setUsers(prev => prev.filter(u => u.id !== userId));
            showAlert("User Deleted Successfully ✅");
        } catch (err) {
            showError(err.message || "User Deletion Failed ❌");
        } finally {
            hideLoading();
        }
    };

    const handleUpdate = (updatedUser) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === updatedUser.id ? updatedUser : user
            )
        );
    };

    return (
        <div className="card text-center d-flex flex-column" style={{ height: '100%' }}>
            <div className="card-header sticky-top bg-primary text-light">List Of Users</div>
            <div className="card-body custom-scrollbar" style={{ overflowY: 'auto' }}>
                <div className="accordion" id={accordionParent}>
                    {users.length > 0 ? users.map((user, idx) => (
                        <div className="row mb-2" key={user.id}>
                            <small className="col-1 d-flex align-items-center justify-content-center">{idx + 1}</small>
                            <div className="col">
                                <UserAccordion
                                    user={user}
                                    accordionId={`accordion-${user.id}`}
                                    accordionParent={accordionParent}
                                    onDelete={() => handleDelete(user.id)}
                                    onUpdate={handleUpdate}
                                />
                            </div>
                        </div>
                    )) : <h1>No Users</h1>}
                </div>
            </div>
        </div>
    );
}