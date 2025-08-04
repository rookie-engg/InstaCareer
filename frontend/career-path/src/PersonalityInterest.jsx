// import React from 'react';
// import './personality.css';

// function PersonalityInterest() {
//     return (
//         <div className='outer bg-body-secondary'>
//             <section id='heading'>
//                 <center>
//                     <img src="/images/bg20.jpg" alt="logo" width="70" height="70" />
//                 </center>
//                 <center>
//                     <h1 style={{ paddingTop: '2rem' }}>Personality Insight Dashboard</h1>
//                 </center>
//                 <h5 style={{ color: 'grey', textAlign: 'center' }}>
//                     Explore your personality progression
//                 </h5>
//             </section>
//             {/* ------------------------------- */}
//             <section className='Interest-Traits'>
//                 <h4>Interest traits</h4>

//             </section>
//         </div>
//     );
// };

// export default PersonalityInterest;
//---------------------------------------------------------------------------------------------------

// import React from 'react';
// import './personality.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// function PersonalityInterest() {


//     const coreValues = [
//         { label: 'Creativity', icon: '🎨', color: '#0d6efd' },
//         { label: 'Innovation', icon: '💡', color: '#6f42c1' },
//         { label: 'Storytelling', icon: '📖', color: '#fd7e14' },
//         { label: 'Collaboration', icon: '🤝', color: '#198754' },
//         { label: 'Artistic Expression', icon: '🎭', color: '#dc3545' }
//     ];

//     return (
//         <div className='outer bg-body-secondary'>
//             <section id='heading'>
//                 <center>
//                     <img src="/images/bg20.jpg" alt="logo" width="70" height="70" />
//                 </center>
//                 <center>
//                     <h1 style={{ paddingTop: '2rem' }}>Personality Insight Dashboard</h1>
//                 </center>
//                 <h5 style={{ color: 'grey', textAlign: 'center' }}>
//                     Explore your personality progression
//                 </h5>
//             </section>



//             {/* Core Values Section */}
//             <section className='Core-Values mt-4'>
//                 <h4>Core Values</h4>
//                 <div className="row">
//                     {coreValues.map((value, index) => (
//                         <div key={index} className="col-md-4 mb-3">
//                             <div className="card h-100" style={{ borderLeft: `8px solid ${value.color}` }}>
//                                 <div className="card-body">
//                                     <h5 className="card-title">
//                                         <span style={{ fontSize: '1.5rem' }}>{value.icon}</span> {value.label}
//                                     </h5>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </section>
//         </div>
//     );
// }

// export default PersonalityInterest;
import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from 'react-router-dom';

const PersonalityInterest = () => {
  // console.log(modelRes)
  // return <div>personlity</div>
  // const interestTraits = [
  //   { label: 'Creative', value: 80, color: '#6f42c1' },
  //   { label: 'Analytical', value: 75, color: '#0d6efd' },
  //   { label: 'Imaginative', value: 90, color: '#6610f2' },
  //   { label: 'Technical', value: 70, color: '#20c997' },
  //   { label: 'Witty', value: 85, color: '#fd7e14' },
  //   { label: 'Observant', value: 65, color: '#198754' },
  //   { label: 'Humorous', value: 78, color: '#ffc107' }
  // ];

  // const emotionalPatterns = [
  //   { label: 'Creative', level: 85, color: '#6610f2' },
  //   { label: 'Energetic', level: 90, color: '#d63384' },
  //   { label: 'Optimistic', level: 75, color: '#fd7e14' },
  //   { label: 'Passionate', level: 95, color: '#dc3545' },
  //   { label: 'Detailed', level: 70, color: '#20c997' }
  // ];

  // const coreValues = [
  //   { label: 'Creativity', icon: '🎨', color: '#0d6efd' },
  //   { label: 'Innovation', icon: '💡', color: '#6f42c1' },
  //   { label: 'Storytelling', icon: '📖', color: '#fd7e14' },
  //   { label: 'Collaboration', icon: '🤝', color: '#198754' },
  //   { label: 'Artistic Expression', icon: '🎭', color: '#dc3545' }
  // ];

  // const selfConcept = [
  //   { label: 'Creative', score: 85 },
  //   { label: 'Logical', score: 78 },
  //   { label: 'Visionary', score: 92 },
  //   { label: 'Strategic', score: 88 },
  //   { label: 'Responsible', score: 80 }
  // ];

  // const oceanTraits = [
  //   {
  //     name: 'Openness', icon: '💡', score: 88, color: '#a16ae8', angle: 270,
  //     facets: [
  //       { name: 'Fantasy', value: 85 }, { name: 'Aesthetics', value: 90 },
  //       { name: 'Feelings', value: 80 }, { name: 'Actions', value: 75 },
  //       { name: 'Ideas', value: 92 }, { name: 'Values', value: 85 }
  //     ]
  //   },
  //   {
  //     name: 'Conscientiousness', icon: '📋', score: 75, color: '#5cacf7', angle: 342,
  //     facets: [
  //       { name: 'Competence', value: 78 }, { name: 'Order', value: 72 },
  //       { name: 'Dutifulness', value: 70 }, { name: 'Achievement', value: 76 },
  //       { name: 'Self-discipline', value: 80 }, { name: 'Deliberation', value: 74 }
  //     ]
  //   },
  //   {
  //     name: 'Extraversion', icon: '🗣️', score: 65, color: '#ffab61', angle: 54,
  //     facets: [
  //       { name: 'Warmth', value: 68 }, { name: 'Gregariousness', value: 60 },
  //       { name: 'Assertiveness', value: 70 }, { name: 'Activity', value: 62 },
  //       { name: 'Excitement Seeking', value: 67 }, { name: 'Positive Emotion', value: 65 }
  //     ]
  //   },
  //   {
  //     name: 'Agreeableness', icon: '🤝', score: 82, color: '#63d7b0', angle: 126,
  //     facets: [
  //       { name: 'Trust', value: 85 }, { name: 'Straightforwardness', value: 78 },
  //       { name: 'Altruism', value: 80 }, { name: 'Compliance', value: 79 },
  //       { name: 'Modesty', value: 75 }, { name: 'Tender-Mindedness', value: 84 }
  //     ]
  //   },
  //   {
  //     name: 'Neuroticism', icon: '😟', score: 45, color: '#f27373', angle: 198,
  //     facets: [
  //       { name: 'Anxiety', value: 50 }, { name: 'Hostility', value: 40 },
  //       { name: 'Depression', value: 48 }, { name: 'Self-Consciousness', value: 43 },
  //       { name: 'Impulsiveness', value: 47 }, { name: 'Vulnerability', value: 44 }
  //     ]
  //   }
  // ];
  const REQUEST_STATE = { PENDING: 'pending', FAILED: 'failed', COMPLETED: 'completed', NOTFOUND: 'notfound' }

  // Function to generate a random color
  const navigator = useNavigate();
  const { correlatedId } = useParams();
  const [modelRes, setModelRes] = useState(null);
  // oceanTraits, coreValues, emotionalPatterns, interestTraits, selfConcept 
  const [oceanTraits, setOceanTraits] = useState(null);
  const [coreValues, setCoreValues] = useState(null);
  const [emotionalPatterns, setEmotionalPatterns] = useState(null);
  const [interestTraits, setInterestTraits] = useState(null);
  const [selfConcept, setSelfConcept] = useState(null);
  const [requestStatus, setRequestStatus] = useState(REQUEST_STATE.PENDING);
  const timerRef = useRef(null); 


  useEffect(() => {
    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }


    // Function to transform the modelRes data into the desired frontend format
    function transformData(data) {
      console.log(data);

      // Mapping for consistent colors and icons for OCEAN traits
      const oceanMapping = {
        "openness": { icon: '💡', color: '#a16ae8', angle: 270, facets: ['Fantasy', 'Aesthetics', 'Feelings', 'Actions', 'Ideas', 'Values'] },
        "conscientiousness": { icon: '📋', color: '#5cacf7', angle: 342, facets: ['Competence', 'Order', 'Dutifulness', 'Achievement', 'Self-discipline', 'Deliberation'] },
        "extraversion": { icon: '🗣️', color: '#ffab61', angle: 54, facets: ['Warmth', 'Gregariousness', 'Assertiveness', 'Activity', 'Excitement Seeking', 'Positive Emotion'] },
        "agreeableness": { icon: '🤝', color: '#63d7b0', angle: 126, facets: ['Trust', 'Straightforwardness', 'Altruism', 'Compliance', 'Modesty', 'Tender-Mindedness'] },
        "neuroticism": { icon: '😟', color: '#f27373', angle: 198, facets: ['Anxiety', 'Hostility', 'Depression', 'Self-Consciousness', 'Impulsiveness', 'Vulnerability'] }
      };

      // Transform interestTraits using self_concept from modelRes
      const interestTraits = data.self_concept_attributes.map(trait => ({
        label: trait,
        value: Math.floor(Math.random() * (95 - 60 + 1)) + 60, // Random score between 60 and 95
        color: getRandomColor()
      }));

      // Transform emotionalPatterns
      const emotionalPatterns = data.emotional_patterns.map(pattern => ({
        label: pattern,
        level: Math.floor(Math.random() * (95 - 70 + 1)) + 70, // Random level between 70 and 95
        color: getRandomColor()
      }));

      // Transform coreValues
      const coreValues = data.values.map(value => ({
        label: value,
        icon: '✨', // Assign a generic icon, or you can map specific icons if needed
        color: getRandomColor()
      }));

      // Transform selfConcept
      const selfConcept = data.self_concept_attributes.map(concept => ({
        label: concept,
        score: Math.floor(Math.random() * (95 - 70 + 1)) + 70 // Random score between 70 and 95
      }));

      // Transform oceanTraits
      const oceanTraits = Object.keys(data.ocean_traits).map(key => {
        const traitData = data.ocean_traits[key];
        const mappedData = oceanMapping[key] || {}; // Get mapped icon, color, angle, and facets
        return {
          name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
          icon: mappedData.icon || '❓', // Use mapped icon or a default
          score: traitData.score,
          color: mappedData.color || getRandomColor(), // Use mapped color or random
          angle: mappedData.angle || Math.floor(Math.random() * 360), // Use mapped angle or random
          facets: (mappedData.facets || []).map(facetName => ({
            name: facetName,
            value: Math.floor(Math.random() * (95 - 40 + 1)) + 40 // Random facet value
          }))
        };
      });

      return {
        interestTraits,
        emotionalPatterns,
        coreValues,
        selfConcept,
        oceanTraits
      };
    }

    //   const pollingRequestStatus = setInterval(() => {
    //     fetch(`/icareer/api/profile/${correlatedId}`).then(async (res) => {
    //       if (res.status === 404 || res.status === 400) {
    //         setRequestStatus(REQUEST_STATE.NOTFOUND);
    //         clearInterval(pollingRequestStatus);
    //       }

    //       if (res.status === 200) {
    //         clearInterval(pollingRequestStatus);
    //         setRequestStatus(REQUEST_STATE.COMPLETED);

    //         let data = transformData(await res.json());

    //         const { oceanTraits, coreValues, emotionalPatterns, interestTraits, selfConcept } = data;
    //         setModelRes(data);
    //         setOceanTraits(oceanTraits);
    //         setCoreValues(coreValues);
    //         setEmotionalPatterns(emotionalPatterns);
    //         setInterestTraits(interestTraits);
    //         setSelfConcept(selfConcept);
    //         return;
    //       }

    //       if (res.status === 202) {
    //         setRequestStatus(REQUEST_STATE.PENDING);
    //         return;
    //       }

    //       if (res.status === 500) {
    //         setRequestStatus(REQUEST_STATE.FAILED);
    //         clearInterval(pollingRequestStatus);
    //       }
    //     });
    //   }, 1000);

    //   return () => {
    //     clearInterval(pollingRequestStatus);
    //   };

    // }, [correlatedId]);



    // A controller to abort the fetch request if the component unmounts
    const controller = new AbortController();
    const signal = controller.signal;

    const pollForStatus = async () => {
      try {
        const response = await fetch(`/icareer/api/profile/${correlatedId}`, { signal });

        // Handle terminal success state
        if (response.status === 200) {
          setRequestStatus(REQUEST_STATE.COMPLETED);
          const data = transformData(await response.json());
          const { oceanTraits, coreValues, emotionalPatterns, interestTraits, selfConcept } = data;

          setModelRes(data);
          setOceanTraits(oceanTraits);
          setCoreValues(coreValues);
          setEmotionalPatterns(emotionalPatterns);
          setInterestTraits(interestTraits);
          setSelfConcept(selfConcept);
          return; // Stop polling
        }

        // Handle pending state
        if (response.status === 202) {
          setRequestStatus(REQUEST_STATE.PENDING);
          // Wait 1 second and poll again
          timerRef.current = setTimeout(pollForStatus, 4000);
          return;
        }

        // Handle terminal error states
        if (response.status === 400 || response.status === 404) {
          setRequestStatus(REQUEST_STATE.NOTFOUND);
        } else if (response.status === 500) {
          setRequestStatus(REQUEST_STATE.FAILED);
        }
        // Stop polling on client or server errors

      } catch (error) {
        // Avoid setting state if the error is due to component unmounting
        if (error.name !== 'AbortError') {
          console.error("Polling request failed:", error);
          setRequestStatus(REQUEST_STATE.FAILED);
        }
      }
    };

    // Start the initial poll
    pollForStatus();

    // Cleanup function to run when the component unmounts
    return () => {
      controller.abort(); // Abort any in-flight fetch request
      if (timerRef.current) {
        clearTimeout(timerRef.current); // Clear any scheduled timeout
      }
    };

  }, [correlatedId]); 


  const cx = 200, cy = 200, radius = 150;

  if (requestStatus == REQUEST_STATE.PENDING) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1>Your Profile is processing</h1>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );

  if (requestStatus == REQUEST_STATE.FAILED) return (
    <h1>Request Processing Failed</h1>
  )

  if (requestStatus == REQUEST_STATE.NOTFOUND) return (
    <h2>Request Not Found</h2>
  )

  return (
    <div className="container py-5">
      <h4 className="text-center fw-bold mb-4">🎵 Interest Traits (Block Grid View)</h4>
      <div className="row g-4 justify-content-center mb-5">
        {interestTraits && interestTraits.map((trait, index) => (
          <div key={index} className="col-6 col-md-4 col-lg-3">
            <div className="p-4 text-white text-center rounded shadow" style={{ backgroundColor: trait.color, height: '100%' }}>
              <h5 className="fw-bold mb-2">{trait.label}</h5>
              <div style={{ fontSize: '1.5rem' }}>{trait.value}%</div>
            </div>
          </div>
        ))}
      </div>

      <h4 className="text-center fw-bold mb-4">💖 Emotional Patterns</h4>
      <div className="d-flex flex-column gap-3 mb-5">
        {emotionalPatterns && emotionalPatterns.map((emotion, idx) => (
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

      <h4 className="text-center fw-bold mb-4">💡 Core Values</h4>
      <div className="d-flex flex-wrap justify-content-center gap-4 mb-5">
        {coreValues && coreValues.map((val, idx) => (
          <div key={idx} className="rounded shadow text-white d-flex align-items-center justify-content-center flex-column"
            style={{ width: '140px', height: '140px', backgroundColor: val.color, fontWeight: 'bold', fontSize: '16px' }}>
            <div style={{ fontSize: '30px' }}>{val.icon}</div>
            {val.label}
          </div>
        ))}
      </div>

      <h4 className="text-center fw-bold mb-4">🧭 Self-Concept Attributes</h4>
      <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
        {selfConcept && selfConcept.map((attr, idx) => (
          <div key={idx} className="col">
            <div className="card shadow-sm text-center">
              <div className="card-body">
                <h6 className="card-title fw-bold">{attr.label}</h6>
                <div
                  className="rounded-circle mx-auto my-2 d-flex align-items-center justify-content-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#0dcaf0',
                    color: '#fff',
                    fontSize: '20px',
                    fontWeight: 'bold'
                  }}
                >
                  {attr.score}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h4 className="text-center fw-bold mb-4">🌈 OCEAN Personality Compass</h4>
      <div className="d-flex justify-content-center mb-5">
        <svg width="400" height="400">
          <defs>
            {oceanTraits && oceanTraits.map((trait, i) => (
              <radialGradient id={`grad${i}`} key={i} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="100%" stopColor={trait.color} />
              </radialGradient>
            ))}
          </defs>
          <circle cx={cx} cy={cy} r={radius} fill="#f0f8ff" stroke="#ced4da" strokeWidth="2" />
          {oceanTraits && oceanTraits.map((trait, index) => {
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

      <div className="row mt-4 mb-4">
        {oceanTraits && oceanTraits.map((trait, idx) => (
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
      <div className="row">
        <button className='btn btn-primary' onClick={() => navigator(`/dashboard/career/${correlatedId}`)}>Careers Suggestions</button>
      </div>
    </div>
  );
};

export default PersonalityInterest;
