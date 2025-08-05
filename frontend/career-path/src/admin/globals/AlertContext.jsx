// AlertContext.js
import React, { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export function AlertProvider({ children }) {
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const showAlert = (message) => {
        setAlertMessage(message);
        setIsAlertVisible(true);
    };

    const hideAlert = () => {
        setIsAlertVisible(false);
        setAlertMessage("");
    };

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            {/* Modal */}
            <div
                className={`modal fade ${isAlertVisible ? "show d-block" : ""}`}
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-warning text-white">
                            <h5 className="modal-title">Alert</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={hideAlert}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p>{alertMessage}</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={hideAlert}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AlertContext.Provider>
    );
}

export function useAlert() {
    return useContext(AlertContext);
}
