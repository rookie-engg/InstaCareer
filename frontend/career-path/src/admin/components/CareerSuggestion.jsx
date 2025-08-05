import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./careerSuggestion.css"; // Make sure this CSS file exists

const CareerSuggestion = ({ careerData }) => {

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  if (!careerData) {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{minHeight: '50vh'}}>
            <div className="text-center">
                <h3>Loading career data...</h3>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="career-bg">
        <div className="parallax-layer" style={{ backgroundImage: "url(/images/careerBack1.png)" }}></div>
        <div className="parallax-layer" style={{ backgroundImage: "url(/images/careerBack2.png)", top: "200px" }}></div>

        <div className="container py-5 text-white position-relative">
            <h2 className="text-center mb-5 fw-bold" data-aos="fade-down">
                Career Suggestions Dashboard
            </h2>

            <section className="mb-5" data-aos="fade-right">
                <h4 className="mb-4 fw-bold text-info">
                    Career Suggestions with Justifications
                </h4>
                <div className="row g-4">
                    {(careerData.career_suggestions || []).map((career, index) => {
                        const confidence = Math.round((careerData.confidence_scores[career] || 0) * 100);
                        const justification = careerData.career_justifications[career] || "No justification available.";
                        const confidenceColor = confidence >= 80 ? "#198754" : confidence >= 60 ? "#ffc107" : "#dc3545";

                        return (
                            <div className="col-md-6 col-lg-4" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                                <div className="card gradient-card text-dark p-3 shadow h-100 position-relative border-2" style={{ borderTop: `6px solid ${confidenceColor}`, borderRadius: "1rem", overflow: "hidden", transition: "transform 0.3s ease" }}>
                                    <div className="card-body">
                                        <h5 className="fw-semibold mb-2 mt-2 d-flex justify-content-between align-items-center">
                                            {career}
                                            <span className="badge rounded-pill bg-info text-dark">{confidence}%</span>
                                        </h5>
                                        <p className="text-muted small">{justification}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="mb-5" data-aos="fade-left">
                <h4 className="mb-4 fw-bold text-warning">Mapped Interests to Careers</h4>
                <ul className="list-group">
                    {Object.entries(careerData.mapped_interest_to_careers || {}).map(([interest, careers], idx) => (
                        <li className="list-group-item bg-transparent text-white border border-light" key={idx}>
                            <strong className="text-light">{interest}:</strong>{" "}
                            {(careers || []).map((career, i) => (
                                <span className="badge bg-secondary me-2" key={i}>{career}</span>
                            ))}
                        </li>
                    ))}
                </ul>
            </section>

            <section className="mb-5" data-aos="fade-up">
                <h4 className="mb-4 fw-bold text-success">Confidence Scores</h4>
                {Object.entries(careerData.confidence_scores || {}).map(([career, score], idx) => {
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
        </div>
    </div>
  );
};

export default CareerSuggestion;