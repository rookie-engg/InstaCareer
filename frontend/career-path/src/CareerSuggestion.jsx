import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./careerSuggestion.css";
import { useAuth } from "./components/AuthContext";

const CareerSuggestion = () => {
  const REQUEST_STATE = { PENDING: 'pending', FAILED: 'failed', COMPLETED: 'completed', NOTFOUND: 'notfound' };

  const { correlatedId, userid } = useParams();
  const [requestStatus, setRequestStatus] = useState(REQUEST_STATE.PENDING);
  const [careerData, setCareerData] = useState(null); // State to hold the fetched career data
  const navigator = useNavigate();
  const { token, setToken } = useAuth();
  /**
   * Handles the PDF generation process.
   * It creates a new window, copies the report's HTML and all associated styles,
   * and then triggers the browser's print dialog.
   */
  const handleGeneratePdf = () => {
    // 1. Get the specific element you want to print by its ID.
    const printContents = document.getElementById('printableCareerReport');
    if (!printContents) {
      console.error("Error: Could not find element with id 'printableCareerReport'");
      return;
    }
    const contentToPrint = printContents.innerHTML;

    // 2. Open a new window for printing.
    const printWindow = window.open('', '', 'height=800,width=1000');

    // 3. Write the document structure to the new window.
    printWindow.document.write('<html><head><title>Career Suggestion Report</title>');

    // 4. Find and append all stylesheets from the parent document to the new window.
    Array.from(document.styleSheets).forEach(styleSheet => {
      if (styleSheet.href) {
        const link = printWindow.document.createElement('link');
        link.rel = 'stylesheet';
        link.href = styleSheet.href;
        printWindow.document.head.appendChild(link);
      } else if (styleSheet.cssRules) {
        const style = printWindow.document.createElement('style');
        style.textContent = Array.from(styleSheet.cssRules).map(rule => rule.cssText).join('\n');
        printWindow.document.head.appendChild(style);
      }
    });

    // 5. Add print-specific styles to hide non-essential elements.
    printWindow.document.write(`
        <style>
            @media print {
                body { 
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .no-print { 
                    display: none !important;
                }
            }
        </style>
    `);

    printWindow.document.write('</head><body>');
    printWindow.document.write(contentToPrint);
    printWindow.document.write('</body></html>');

    printWindow.document.close();
    printWindow.focus();

    // 7. Wait for content and styles to load, then trigger print.
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
  };

  useEffect(() => {
    AOS.init({ duration: 800 });

    // Start polling the API for results
    const pollingRequestStatus = setInterval(() => {
      // Assuming the same endpoint provides all profile data, including career suggestions
      fetch(`/icareer/api/profile/${correlatedId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(async (res) => {

        if (res.status === 404 || res.status === 400) {
          setRequestStatus(REQUEST_STATE.NOTFOUND);
          clearInterval(pollingRequestStatus);
        }

        if (res.status === 200) {
          clearInterval(pollingRequestStatus);
          setRequestStatus(REQUEST_STATE.COMPLETED);
          const data = await res.json();
          setCareerData(data); // Set the fetched data into state
          return;
        }

        if (res.status === 202) {
          setRequestStatus(REQUEST_STATE.PENDING);
          return;
        }

        if (res.status === 500) {
          setRequestStatus(REQUEST_STATE.FAILED);
          clearInterval(pollingRequestStatus);
        }
      });
    }, 1000);

    return () => clearInterval(pollingRequestStatus);
  }, [correlatedId]); // Rerun effect if correlatedId changes

  // Conditional rendering based on request status
  if (requestStatus === REQUEST_STATE.PENDING) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <h1>Processing Career Suggestions...</h1>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (requestStatus === REQUEST_STATE.FAILED) {
    return <h1 className="text-center mt-5">Request Processing Failed</h1>;
  }

  if (requestStatus === REQUEST_STATE.NOTFOUND) {
    return <h2 className="text-center mt-5">Request Not Found</h2>;
  }

  // Render the main component once data is successfully fetched
  return (
    careerData && (
      <div id="printableCareerReport" className="career-bg">
        <div class="sticky-top d-flex w-100 flex-row-reverse">
          <button className="btn btn-info p-2 mt-2 me-4" onClick={() => navigator(`/prev-history/${userid}`)}>Home</button>
        </div>
        {/* Parallax Layers */}
        <div
          className="parallax-layer"
          style={{ backgroundImage: "url(/images/careerBack1.png)" }}
        ></div>
        <div
          className="parallax-layer"
          style={{ backgroundImage: "url(/images/careerBack2.png)", top: "200px" }}
        ></div>

        <div className="container py-5 text-white position-relative">
          <h2 className="text-center mb-5 fw-bold" data-aos="fade-down">
            💼 Career Suggestions Dashboard
          </h2>

          {/* Section 1: Career Suggestions with Justifications */}
          <section className="mb-5" data-aos="fade-right">
            <h4 className="mb-4 fw-bold text-info">
              1️⃣ Career Suggestions with Justifications
            </h4>
            <div className="row g-4">
              {careerData.career_suggestions.map((career, index) => {
                const confidence = Math.round((careerData.confidence_scores[career] || 0) * 100);
                const justification = careerData.career_justifications[career] || "No justification available.";
                const confidenceColor =
                  confidence >= 80 ? "#198754" : confidence >= 60 ? "#ffc107" : "#dc3545";

                return (
                  <div
                    className="col-md-6 col-lg-4"
                    key={career}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div
                      className="card gradient-card text-dark p-3 shadow h-100 position-relative border border-2"
                      style={{
                        borderTop: `6px solid ${confidenceColor}`,
                        borderRadius: "1rem",
                        overflow: "hidden",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <div className="card-body">
                        <h5 className="fw-semibold mb-2 mt-2 d-flex justify-content-between align-items-center">
                          {career}
                          <span className="badge rounded-pill bg-info text-dark">
                            {confidence}%
                          </span>
                        </h5>
                        <p className="text-muted small">{justification}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 2: Mapped Interests to Careers */}
          <section className="mb-5" data-aos="fade-left">
            <h4 className="mb-4 fw-bold text-warning">2️⃣ Mapped Interests to Careers</h4>
            <ul className="list-group">
              {Object.entries(careerData.mapped_interest_to_careers).map(([interest, careers], idx) => (
                <li
                  className="list-group-item bg-transparent text-white border border-light"
                  key={idx}
                >
                  <strong className="text-light">{interest}:</strong>{" "}
                  {careers.map((career, i) => (
                    <span className="badge bg-secondary me-2" key={i}>
                      {career}
                    </span>
                  ))}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3: Confidence Scores */}
          <section className="mb-5" data-aos="fade-up">
            <h4 className="mb-4 fw-bold text-success">3️⃣ Confidence Scores</h4>
            {Object.entries(careerData.confidence_scores).map(([career, score], idx) => {
              const percentage = Math.round(score * 100);
              return (
                <div className="mb-3" key={idx}>
                  <label className="form-label text-white fw-medium">
                    {career} - {percentage}%
                  </label>
                  <div className="progress" style={{ height: "20px" }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                      role="progressbar"
                      style={{ width: `${percentage}%` }}
                      aria-valuenow={percentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {percentage}%
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Generate Report Button - will not be printed */}
          <div className="row justify-content-center pt-4 no-print">
            <div className="col">
              <button type="button" className="btn btn-warning w-100" onClick={handleGeneratePdf}>
                Generate Report
              </button>
            </div>
          </div>

        </div>
      </div>
    )
  );
};

export default CareerSuggestion;
