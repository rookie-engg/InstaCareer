import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useLoading } from "./globals/LoadingContext";
import { useError } from "./globals/ErrorContext";
import { useAlert } from "./globals/AlertContext";
import HistoryAccordions from "./components/HistoryAccordions";

export default function UpdateUser() {
    // ✅ Destructure the new date fields from the URL parameters
    const { userId, userName, userEmail, createdAt, updatedAt } = useParams();
    const { showLoading, hideLoading } = useLoading();
    const { showError } = useError();
    const { showAlert } = useAlert();
    const [editData, setEditData] = useState({ username: userName, email: userEmail });
    const offCanvasId = "UpdateoffcanvasTop" + userId;

    return (
        <>
            <Link to="/admin" className="btn btn-primary mb-3">
                <i className="bi bi-arrow-left-circle"></i> Back to All Users
            </Link>

            <div className="container mt-3">
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label fw-bold">Username:</label>
                            <div className="col-sm-10">
                                <p className="form-control-plaintext mb-0">{userName || "N/A"}</p>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label fw-bold">User ID:</label>
                            <div className="col-sm-10">
                                <p className="form-control-plaintext mb-0">{userId}</p>
                            </div>
                        </div>
                        {/* ✅ Added display for createdAt */}
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label fw-bold">Created At:</label>
                            <div className="col-sm-10">
                                <p className="form-control-plaintext mb-0">{new Date(createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        {/* ✅ Added display for updatedAt */}
                        <div className="row mb-3">
                            <label className="col-sm-2 col-form-label fw-bold">Updated At:</label>
                            <div className="col-sm-10">
                                <p className="form-control-plaintext mb-0">{new Date(updatedAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-2">
                        {/* Update and Delete buttons... */}
                    </div>
                </div>
                <HistoryAccordions userId={userId} />
            </div>
        </>
    );
}