import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './personality.css'; // Make sure this CSS file exists
import 'bootstrap/dist/css/bootstrap.min.css';

const PersonalityInterest = ({ modelRes, correlatedId }) => {
    console.log(modelRes);
    
    const navigator = useNavigate();

    useEffect(() => {
        if (modelRes) {
            // This logic is for animating cards as they scroll into view
            const cards = document.querySelectorAll(".Cards, .card.shadow-sm");
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("show");
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1 }
            );
            cards.forEach((card) => observer.observe(card));
        }
    }, [modelRes]);

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const transformData = (data) => {
        if (!data) return { oceanTraits: [], coreValues: [], emotionalPatterns: [], interestTraits: [], selfConcept: [] };

        const oceanMapping = {
            "openness": { icon: '💡', color: '#a16ae8', angle: 270, facets: ['Fantasy', 'Aesthetics', 'Feelings', 'Actions', 'Ideas', 'Values'] },
            "conscientiousness": { icon: '📋', color: '#5cacf7', angle: 342, facets: ['Competence', 'Order', 'Dutifulness', 'Achievement', 'Self-discipline', 'Deliberation'] },
            "extraversion": { icon: '🗣️', color: '#ffab61', angle: 54, facets: ['Warmth', 'Gregariousness', 'Assertiveness', 'Activity', 'Excitement Seeking', 'Positive Emotion'] },
            "agreeableness": { icon: '🤝', color: '#63d7b0', angle: 126, facets: ['Trust', 'Straightforwardness', 'Altruism', 'Compliance', 'Modesty', 'Tender-Mindedness'] },
            "neuroticism": { icon: '😟', color: '#f27373', angle: 198, facets: ['Anxiety', 'Hostility', 'Depression', 'Self-Consciousness', 'Impulsiveness', 'Vulnerability'] }
        };

        // ✅ **FIX**: This section now correctly uses 'self_concept_attributes', which is always an array in your data.
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

    const { oceanTraits, coreValues, emotionalPatterns, interestTraits, selfConcept } = transformData(modelRes);
    const cx = 200, cy = 200, radius = 150;

    return (
        <div className="outer py-5 bg-body-secondary">
            <div className="container">
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

                <section className='Cards mt-4'>
                    <h4 className="text-center fw-bold mb-4">🌈 OCEAN Personality Compass</h4>
                    <div className="d-flex justify-content-center mb-5">
                        <svg width="400" height="400" viewBox="0 0 400 400">
                            <defs>
                                {oceanTraits.map((trait, i) => (
                                    <radialGradient id={`grad${correlatedId}-${i}`} key={i} cx="50%" cy="50%" r="50%">
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
                                        <circle cx={x} cy={y} r={24} fill={`url(#grad${correlatedId}-${index})`} stroke="#fff" strokeWidth="2" />
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

                {/* <div className="row pb-4">
                    <button className='btn btn-primary' onClick={() => navigator(`/dashboard/career/${correlatedId}`)}>Careers Suggestions</button>
                </div> */}
            </div>
        </div>
    );
};

export default PersonalityInterest;