import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './personality.css'; // Assuming this CSS file exists for the new styles
import 'bootstrap/dist/css/bootstrap.min.css';

const PersonalityInterest = () => {
    const REQUEST_STATE = { PENDING: 'pending', FAILED: 'failed', COMPLETED: 'completed', NOTFOUND: 'notfound' };

    const navigator = useNavigate();
    const { correlatedId } = useParams();
    const [modelRes, setModelRes] = useState(null);
    const [requestStatus, setRequestStatus] = useState(REQUEST_STATE.PENDING);
    const timerRef = useRef(null);

    // This useEffect handles the data fetching and polling logic
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const pollForStatus = async () => {
            try {
                const response = await fetch(`/icareer/api/profile/${correlatedId}`, { signal });

                if (response.status === 200) {
                    const data = await response.json();
                    setModelRes(data); // Store raw response
                    setRequestStatus(REQUEST_STATE.COMPLETED);
                    return; // Stop polling
                }

                if (response.status === 202) {
                    setRequestStatus(REQUEST_STATE.PENDING);
                    timerRef.current = setTimeout(pollForStatus, 4000); // Poll again after 4 seconds
                    return;
                }

                if (response.status === 400 || response.status === 404) {
                    setRequestStatus(REQUEST_STATE.NOTFOUND);
                } else {
                    setRequestStatus(REQUEST_STATE.FAILED);
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Polling request failed:", error);
                    setRequestStatus(REQUEST_STATE.FAILED);
                }
            }
        };

        pollForStatus();

        return () => {
            controller.abort();
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [correlatedId, REQUEST_STATE.COMPLETED, REQUEST_STATE.FAILED, REQUEST_STATE.NOTFOUND, REQUEST_STATE.PENDING]);

    // This useEffect handles the scroll-triggered animations for cards
    useEffect(() => {
        // Only run the observer if the data has been successfully loaded
        if (requestStatus === REQUEST_STATE.COMPLETED) {
            const cards = document.querySelectorAll(".Cards, .card.shadow-sm");
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("show");
                            observer.unobserve(entry.target); // Animate only once
                        }
                    });
                },
                { threshold: 0.2 } // Trigger when 20% of the element is visible
            );

            cards.forEach((card) => observer.observe(card));
        }
    }, [requestStatus, REQUEST_STATE.COMPLETED]); // Rerun when requestStatus changes

    // Function to generate a random color
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    // Function to transform the modelRes data into the desired frontend format
    const transformData = (data) => {
        const oceanMapping = {
            "openness": { icon: '💡', color: '#a16ae8', angle: 270, facets: ['Fantasy', 'Aesthetics', 'Feelings', 'Actions', 'Ideas', 'Values'] },
            "conscientiousness": { icon: '📋', color: '#5cacf7', angle: 342, facets: ['Competence', 'Order', 'Dutifulness', 'Achievement', 'Self-discipline', 'Deliberation'] },
            "extraversion": { icon: '🗣️', color: '#ffab61', angle: 54, facets: ['Warmth', 'Gregariousness', 'Assertiveness', 'Activity', 'Excitement Seeking', 'Positive Emotion'] },
            "agreeableness": { icon: '🤝', color: '#63d7b0', angle: 126, facets: ['Trust', 'Straightforwardness', 'Altruism', 'Compliance', 'Modesty', 'Tender-Mindedness'] },
            "neuroticism": { icon: '😟', color: '#f27373', angle: 198, facets: ['Anxiety', 'Hostility', 'Depression', 'Self-Consciousness', 'Impulsiveness', 'Vulnerability'] }
        };

        const interestTraits = (data.self_concept_attributes || []).map(trait => ({
            label: trait,
            value: Math.floor(Math.random() * (95 - 60 + 1)) + 60,
            color: getRandomColor()
        }));

        const emotionalPatterns = (data.emotional_patterns || []).map(pattern => ({
            label: pattern,
            level: Math.floor(Math.random() * (95 - 70 + 1)) + 70,
            color: getRandomColor()
        }));

        const coreValues = (data.values || []).map(value => ({
            label: value,
            icon: '✨',
            color: getRandomColor()
        }));

        const selfConcept = (data.self_concept_attributes || []).map(concept => ({
            label: concept,
            score: Math.floor(Math.random() * (95 - 70 + 1)) + 70
        }));

        const oceanTraits = Object.keys(data.ocean_traits || {}).map(key => {
            const traitData = data.ocean_traits[key];
            const mappedData = oceanMapping[key] || {};
            return {
                name: key.charAt(0).toUpperCase() + key.slice(1),
                icon: mappedData.icon || '❓',
                score: traitData.score,
                color: mappedData.color || getRandomColor(),
                angle: mappedData.angle || Math.floor(Math.random() * 360),
                facets: (mappedData.facets || []).map(facetName => ({
                    name: facetName,
                    value: Math.floor(Math.random() * (95 - 40 + 1)) + 40
                }))
            };
        });

        return { interestTraits, emotionalPatterns, coreValues, selfConcept, oceanTraits };
    };

    if (requestStatus === REQUEST_STATE.PENDING) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
                <h1>Your Profile is processing</h1>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );

    if (requestStatus === REQUEST_STATE.FAILED) return (<h1>Request Processing Failed</h1>);
    if (requestStatus === REQUEST_STATE.NOTFOUND) return (<h2>Request Not Found</h2>);

    // Transform data only when it's available and the component is ready to render
    const { oceanTraits, coreValues, emotionalPatterns, interestTraits, selfConcept } = transformData(modelRes);
    const cx = 200, cy = 200, radius = 150;

    return (
        <div className="outer py-5 bg-body-secondary">
            <div className="container">
                {/* Heading section */}
                <section id='heading'>
                    <center>
                        <img className='logo' src="/images/appLogo.png" alt="logo" width="110" height="110" />
                    </center>
                    <center>
                        <h1 className='pageHeading' style={{ paddingTop: '0.5rem' }}>Personality Insight Dashboard</h1>
                    </center>
                    <h5 className='pageHeading2' style={{ color: 'white', textAlign: 'center' }}>
                        Explore your personality progression
                    </h5>
                </section>

                {/* Core values */}
                <section className='Cards mt-4'>
                    <h4 className="text-center fw-bold mb-4">💡 Core Values</h4>
                    <div className="d-flex flex-wrap justify-content-center gap-4 mb-5">
                        {coreValues.map((val, idx) => (
                            <div key={idx} className="rounded text-white d-flex align-items-center justify-content-center flex-column"
                                style={{ width: '130px', height: '130px', backgroundColor: val.color, fontWeight: 'bold', fontSize: '16px' }}>
                                <div style={{ fontSize: '25px' }}>{val.icon}</div>
                                {val.label}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Emotional Pattern */}
                <section className='Cards mt-4'>
                    <h4 className="text-center fw-bold mb-4">💖 Emotional Patterns</h4>
                    <div className="d-flex flex-column gap-3 mb-5">
                        {emotionalPatterns.map((emotion, idx) => (
                            <div key={idx}>
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="fw-semibold">{emotion.label}</span>
                                    <span className="text-muted">{emotion.level}%</span>
                                </div>
                                <div className="progress" style={{ height: '20px' }}>
                                    <div className="progress-bar" role="progressbar" style={{ width: `${emotion.level}%`, backgroundColor: emotion.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Interest traits */}
                <section className='Cards mt-4'>
                    <h4 className="text-center fw-bold mb-4">🎵 Interest Traits</h4>
                    <div className="row g-4 justify-content-center mb-5">
                        {interestTraits.map((trait, index) => (
                            <div key={index} className="col-6 col-md-4 col-lg-3">
                                <div className="p-4 text-white text-center rounded shadow" style={{ backgroundColor: trait.color, height: '100%' }}>
                                    <h5 className="fw-bold mb-2">{trait.label}</h5>
                                    <div style={{ fontSize: '1.5rem' }}>{trait.value}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Self Concept Attribute */}
                <section className='Cards mt-4'>
                    <h4 className="text-center fw-bold mb-4">🧭 Self-Concept Attributes</h4>
                    <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
                        {selfConcept.map((attr, idx) => (
                            <div key={idx} className="col">
                                <div className="card shadow-sm text-center">
                                    <div className="card-body">
                                        <h6 className="card-title fw-bold">{attr.label}</h6>
                                        <div
                                            className="rounded-circle mx-auto my-2 d-flex align-items-center justify-content-center"
                                            style={{
                                                width: '80px', height: '80px', backgroundColor: '#0dcaf0',
                                                color: '#fff', fontSize: '20px', fontWeight: 'bold'
                                            }}
                                        >
                                            {attr.score}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* OCEAN */}
                <section className='Cards mt-4'>
                    <h4 className="text-center fw-bold mb-4">🌈 OCEAN Personality Compass</h4>
                    <div className="d-flex justify-content-center mb-5">
                        <svg width="400" height="400" viewBox="0 0 400 400">
                            <defs>
                                {oceanTraits.map((trait, i) => (
                                    <radialGradient id={`grad${i}`} key={i} cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="#fff" />
                                        <stop offset="100%" stopColor={trait.color} />
                                    </radialGradient>
                                ))}
                            </defs>
                            <circle cx={cx} cy={cy} r={radius} fill="#f0f8ff" stroke="#ced4da" strokeWidth="2" />
                            {oceanTraits.map((trait, index) => {
                                const angleRad = (trait.angle * Math.PI) / 180;
                                const x = cx + radius * Math.cos(angleRad);
                                const y = cy + radius * Math.sin(angleRad);
                                return (
                                    <g key={index}>
                                        <line x1={cx} y1={cy} x2={x} y2={y} stroke={trait.color} strokeWidth="2" />
                                        <circle cx={x} cy={y} r={24} fill={`url(#grad${index})`} stroke="#fff" strokeWidth="2" />
                                        <text x={x} y={y + 5} textAnchor="middle" fill="#000" fontSize="18" fontWeight="bold">{trait.icon}</text>
                                        <text x={x} y={y + 35} textAnchor="middle" fontSize="13" fill={trait.color}>{trait.name}</text>
                                        <text x={x} y={y + 50} textAnchor="middle" fontSize="12" fill="#333">{trait.score}%</text>
                                    </g>
                                );
                            })}
                            <circle cx={cx} cy={cy} r={40} fill="#ffffff" stroke="#adb5bd" strokeWidth="2" />
                            <text x={cx} y={cy} textAnchor="middle" fill="#000" fontSize="14" fontWeight="bold" dy="4">OCEAN</text>
                        </svg>
                    </div>

                    <div className="row mt-4">
                        {oceanTraits.map((trait, idx) => (
                            <div className="col-md-6 mb-4" key={idx}>
                                <div className="card shadow-sm">
                                    <div className="card-header bg-light fw-bold text-dark">
                                        {trait.icon} {trait.name} – {trait.score}%
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        {trait.facets.map((facet, i) => (
                                            <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                                                {facet.name}
                                                <span className="badge bg-primary rounded-pill">{facet.value}%</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="row pb-4">
                    <button className='btn btn-primary' onClick={() => navigator(`/dashboard/career/${correlatedId}`)}>Careers Suggestions</button>
                </div>
            </div>
        </div>
    );
};

export default PersonalityInterest;