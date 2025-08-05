import { useLoading } from "../globals/LoadingContext";
import { useError } from "../globals/ErrorContext";
import { useAlert } from '../globals/AlertContext';
import HistoryAccordions from './HistoryAccordions';
import '../assests/style.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";

function UserAccordion({ userId, userName, userEmail, accordionId, accordionParent, onDelete, createdAt, updatedAt }) {
    const { showLoading, hideLoading } = useLoading();
    const { showError } = useError();
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const offCanvasId = "UpdateoffcanvasTop" + userId;
    const { token } = useAuth();

    return (
        <div key={"item" + accordionId} className="accordion-item">
            <h2 className="accordion-header d-flex justify-content-between align-items-center px-3">
                {/* Accordion Toggle Button */}
                <button
                    className={`accordion-button collapsed flex-grow-1`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${accordionId}`}
                    aria-expanded={false}
                    aria-controls={accordionId}
                >
                    <div className="w-100">
                        <div className="fw-bold text-secondary">
                            User ID: <span className="text-dark">{userId}</span>
                        </div>
                        <div className="fw-bold text-secondary">
                            User Name: <span className="text-dark">{userName}</span>
                        </div>
                        <div className="fw-bold text-secondary">
                            User Email: <span className="text-dark">{userEmail}</span>
                        </div>
                        {/* ✅ Added createdAt and updatedAt fields */}
                        <div className="fw-bold text-secondary">
                            Created At: <span className="text-dark">{new Date(createdAt).toLocaleString()}</span>
                        </div>
                        <div className="fw-bold text-secondary">
                            Updated At: <span className="text-dark">{new Date(updatedAt).toLocaleString()}</span>
                        </div>
                    </div>
                </button>

                {/* Action Buttons */}
                <div className="ms-2">
                    <button
                        className="btn btn-sm btn-danger w-100"
                        onClick={async (e) => {
                            e.stopPropagation();
                            try {
                                showLoading();
                                const res = await fetch(`/icareer/admin/users/${userId}`, {
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    },
                                    method: 'DELETE'
                                });
                                hideLoading();
                                if (!res.ok) throw new Error("Deletion failed");
                                onDelete();
                                showAlert("User Deleted Successfully ✅");
                            } catch (err) {
                                hideLoading();
                                showError(err.message || "User Deletion Failed ❌");
                            }
                        }}
                    >
                        <i className="bi bi-person-x"></i> Delete
                    </button>
                    <button className="btn btn-sm btn-info w-100 mt-1"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target={`#${offCanvasId}`}
                        aria-controls="offcanvasTop"><i className="bi bi-pen"></i> Update</button>

                    {/* Offcanvas for Update */}
                    <div className="offcanvas offcanvas-top" tabIndex="-1"
                        id={offCanvasId}
                        aria-labelledby={"UpdateoffcanvasTopLabel" + offCanvasId}>
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id={"UpdateoffcanvasTopLabel" + offCanvasId}>Update User</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <form className="offcanvas-body fs-5" onSubmit={async ev => {
                            ev.preventDefault();
                            showLoading();
                            try {
                                const res = await fetch(`/icareer/admin/users/${userId}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    }
                                });
                                hideLoading();
                                if (!res.ok) throw new Error("Update failed");
                                showAlert(`Updated Userid: ${userId} ✅`);
                            } catch {
                                hideLoading();
                                showError(`Error while update (userid: ${userId})`);
                            }
                        }}>
                            <div className="mb-3 row">
                                <label htmlFor="staticUserId" className="col-sm-2 col-form-label">UserID</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly className="form-control-plaintext" id="staticUserId" defaultValue={userId} />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="inputUsername" className="col-sm-2 col-form-label">Username</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="inputUsername" defaultValue={userName} />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Email</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="staticEmail" defaultValue={userEmail} />
                                </div>
                            </div>
                            <div className="w-100 d-flex flex-row-reverse">
                                <button type="submit" className="btn btn-success"><i className="bi bi-bookmark-check"></i> Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </h2>
            <div
                id={accordionId}
                className={`accordion-collapse collapse`}
                data-bs-parent={`#${accordionParent}`}
            >
                <div className="accordion-body">
                    <HistoryAccordions userId={userId} />
                </div>
            </div>
        </div>
    );
}

export default function UserAccordions({ users, setUsers }) {
    const accordionParent = "accordionExample";
    return (
        <div className="card text-center d-flex flex-column" style={{ height: '100%' }}>
            <div className="card-header sticky-top bg-primary text-light">List Of Users</div>
            <div className="card-body custom-scrollbar" style={{ overflowY: 'auto' }}>
                <div className="accordion" id={accordionParent}>
                    {users.length !== 0 ? users.map((userData, idx) => {
                        // ✅ Destructure all required fields including the new date fields
                        const { id, name, email, createdAt, updatedAt } = userData;

                        return <div className="row mb-2" key={id + idx}>
                            <small className="col-1 d-flex align-items-center justify-content-center">{idx + 1}</small>
                            <div className="col">
                                <UserAccordion
                                    key={id}
                                    userId={id}
                                    userEmail={email}
                                    userName={name}
                                    accordionId={id}
                                    accordionParent={accordionParent}
                                    onDelete={() => setUsers(prev => prev.filter(u => u.id !== id))}
                                    createdAt={createdAt}
                                    updatedAt={updatedAt}
                                />
                            </div>
                        </div>
                    }) : <h1>No Users</h1>}
                </div>
            </div>
        </div>
    );
}