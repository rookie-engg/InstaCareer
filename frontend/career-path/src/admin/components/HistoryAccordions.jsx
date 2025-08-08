import React, { useEffect, useState } from "react";
import { useError } from "../globals/ErrorContext";
import { useAlert } from '../globals/AlertContext';
import HistoryAccordionsPlaceholder from "./HistoryAccordionsPlaceholder";
import PersonalityInterest from './PersonalityInterest';
import CareerSuggestion from './CareerSuggestion';
import 'bootstrap/dist/css/bootstrap.min.css';
import './personality.css';
import './careerSuggestion.css';
import { useAuth } from "../../components/AuthContext";

// This modal component is used to display the dashboards.
const DashboardModal = ({ show, handleClose, title, children, onGeneratePdf }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body bg-light" id="dashboard-modal-body">
                        {children}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-warning" onClick={onGeneratePdf}>
                            <i className="bi bi-printer"></i> Generate Report
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// A recursive component to nicely format and display JSON data.
function JSONViewer({ data }) {
    const [openSections, setOpenSections] = useState({});

    const toggleSection = (key) => {
        setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const parsedData = { ...data };
    if (parsedData.userResponse && typeof parsedData.userResponse.responseData === 'string') {
        try {
            parsedData.userResponse.responseData = JSON.parse(parsedData.userResponse.responseData);
        } catch (e) {
            // Silently fail if JSON is invalid
        }
    }

    return (
        <div className="container py-4">
            {Object.entries(parsedData).map(([key, value]) => {
                const isObject = typeof value === 'object' && value !== null;
                const isOpen = !!openSections[key];
                const renderValue = () => isObject ? <JSONViewer data={value} /> : <span className="text-break">{String(value)}</span>;
                return (
                    <div className="mb-3 border rounded" key={key}>
                        <div className="d-flex justify-content-between align-items-center p-3 bg-light" onClick={() => isObject && toggleSection(key)} style={{ cursor: isObject ? "pointer" : "default", borderBottom: '1px solid #dee2e6' }}>
                            <strong>{key}</strong>
                            {isObject && <span style={{ transition: 'transform 0.2s' }} className={isOpen ? 'rotate-90' : ''}>▶</span>}
                        </div>
                        {(isOpen && isObject) && <div className="p-3 bg-white">{renderValue()}</div>}
                        {!isObject && <div className="p-3 bg-white">{renderValue()}</div>}
                    </div>
                );
            })}
        </div>
    );
}

// Represents a single item in the history accordion.
function HistoryAccordion({ historyId, accordionId, accordionParent, history, onDelete, status, errorShownForHistory, setErrorShownForHistory }) {
    const { showError } = useError();
    const { showAlert } = useAlert();
    const [showDashboard, setShowDashboard] = useState(null);
    const [parsedResponse, setParsedResponse] = useState(null);
    const { token } = useAuth();

    // This effect parses the model response data when the history item is completed.
    useEffect(() => {
        if (status === 'COMPLETED') {
            try {
                const responseData = history.userResponse.responseData;
                if (responseData && responseData.model_res) {
                    let modelResData = responseData.model_res;
                    if (typeof modelResData === 'string') {
                        modelResData = JSON.parse(modelResData);
                    }
                    setParsedResponse(modelResData);
                } else {
                    if (!errorShownForHistory.includes(historyId)) {
                        showError("The 'model_res' data is missing or in an incorrect format.");
                        setErrorShownForHistory(prev => [...prev, historyId]);
                    }
                }
            } catch (e) {
                if (!errorShownForHistory.includes(historyId)) {
                    showError("The history data for this item is corrupted.");
                    setErrorShownForHistory(prev => [...prev, historyId]);
                }
            }
        }
    }, [history, status, showError, historyId, errorShownForHistory, setErrorShownForHistory]);

    // Handles the generation of a PDF from the modal's content.
    const handleGeneratePdf = () => {
        const dashboardType = showDashboard;
        if (!dashboardType) return;

        const contentToPrint = document.getElementById('dashboard-modal-body');
        if (!contentToPrint) {
            showError("Could not find the dashboard content to print.");
            return;
        }

        const printWindow = window.open('', '', 'height=800,width=1000');
        printWindow.document.write('<html><head><title>Print Report</title>');
        printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">');
        printWindow.document.write('<style>');
        printWindow.document.write(`
            @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .modal-footer { display: none; }
            }
        `);
        printWindow.document.write('</style></head><body>');
        printWindow.document.write(contentToPrint.innerHTML);
        printWindow.document.write('</body></html>');

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    return (
        <div className="accordion-item">
            <h2 className="accordion-header d-flex justify-content-between align-items-center px-3">
                <div className="d-flex flex-column gap-1">
                    <button className="btn btn-danger btn-sm w-100" onClick={async (e) => {
                        e.stopPropagation();
                        try {
                            const res = await fetch(`/icareer/admin/history/${historyId}`, {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                },
                                method: 'DELETE'
                            });
                            if (!res.ok) throw new Error();
                            onDelete();
                            showAlert("User History Deleted Successfully ✅");
                        } catch {
                            showError("User History Deletion Failed ❌");
                        }
                    }}>
                        <i className="bi bi-trash"></i> Delete
                    </button>
                </div>
                <button
                    className={`col accordion-button collapsed ms-3`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${accordionId}`}
                    aria-expanded={false}
                    aria-controls={accordionId}
                >
                    <div>ID: {historyId}</div>
                </button>
            </h2>
            <div id={accordionId} className={`accordion-collapse collapse`} data-bs-parent={`#${accordionParent}`}>
                <div className="accordion-body">
                    {status === 'COMPLETED' && (
                        <div className="d-flex gap-2 flex-row-reverse mb-3">
                            <button className="btn btn-primary btn-sm" onClick={() => setShowDashboard('personality')}>
                                <i className="bi bi-person-badge"></i> Personality
                            </button>
                            <button className="btn btn-success btn-sm" onClick={() => setShowDashboard('career')}>
                                <i className="bi bi-briefcase"></i> Career
                            </button>
                        </div>
                    )}
                    <JSONViewer data={history} />
                </div>
            </div>

            <DashboardModal
                show={!!showDashboard}
                handleClose={() => setShowDashboard(null)}
                title={showDashboard === 'personality' ? "Personality Insight Dashboard" : "Career Suggestions Dashboard"}
                onGeneratePdf={handleGeneratePdf}
            >
                {showDashboard === 'personality' && (
                    parsedResponse ? <PersonalityInterest modelRes={parsedResponse} correlatedId={historyId} /> : <p>Loading or processing data...</p>
                )}
                {showDashboard === 'career' && (
                    parsedResponse ? <CareerSuggestion careerData={parsedResponse} /> : <p>Loading or processing data...</p>
                )}
            </DashboardModal>
        </div>
    );
}

// The main component that fetches and displays the list of history accordions for a user.
export default function HistoryAccordions({ userId }) {
    const { showError } = useError();
    const [isLoading, setIsLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [errorShownForHistory, setErrorShownForHistory] = useState([]);
    const {token} = useAuth();

    useEffect(() => {
        async function fetchHistory() {
            setIsLoading(true);
            try {
                const res = await fetch(`/icareer/admin/history/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error("Failed to fetch history");
                const data = await res.json();
                setHistory(data);
            } catch {
                showError("An error occurred while fetching user history.");
            }
            setIsLoading(false);
        }
        fetchHistory();
    }, [userId, showError, token]);

    if (isLoading) return <HistoryAccordionsPlaceholder />;

    const accordionParent = "HistoryAccordion-" + userId;
    return (
        <div className="card text-center">
            <div className="card-body">
                <div className="accordion" id={accordionParent}>
                    {history.length > 0 ? history.map((data) =>
                        <HistoryAccordion
                            key={data.id}
                            historyId={data.id}
                            accordionId={userId + data.id}
                            accordionParent={accordionParent}
                            history={data}
                            status={data.status}
                            onDelete={() => setHistory(prev => prev.filter(h => h.id !== data.id))}
                            errorShownForHistory={errorShownForHistory}
                            setErrorShownForHistory={setErrorShownForHistory}
                        />
                    ) : <h1 className="display-6">No History Found</h1>}
                </div>
            </div>
        </div>
    );
}