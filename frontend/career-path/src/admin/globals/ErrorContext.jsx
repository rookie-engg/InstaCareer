// ErrorContext.js
import React, { createContext, useContext, useState } from "react";

const ErrorContext = createContext();

export function ErrorProvider({ children }) {
    const [errorMessage, setErrorMessage] = useState("");
    const [isErrorVisible, setIsErrorVisible] = useState(false);

    const showError = (message) => {
        setErrorMessage(message);
        setIsErrorVisible(true);
    };

    const hideError = () => {
        setIsErrorVisible(false);
        setErrorMessage("");
    };

    return (
        <ErrorContext.Provider value={{ showError, hideError }}>
            {children}
            {/* Modal */}
            <div
                className={`modal fade ${isErrorVisible ? "show d-block" : ""}`}
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-danger text-white">
                            <h5 className="modal-title">Error</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={hideError}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p>{errorMessage}</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={hideError}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ErrorContext.Provider>
    );
}

export function useError() {
    return useContext(ErrorContext);
}
