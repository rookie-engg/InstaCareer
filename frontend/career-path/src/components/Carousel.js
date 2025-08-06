import React from 'react';
import { Carousel, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/HowItWorksCarousel.css';
import slide1 from '../images/slide1.png';
import slide2 from '../images/slide2.png';
import slide3 from '../images/slide3.png';
import slide4 from '../images/slide4.png';
import slide5 from '../images/slide5.png';
import slide6 from '../images/slide6.png';

const HowItWorksCarousel = () => {
  const slides = [
    {
      title: 'Upload Your Watch History',
      description: 'Start by uploading your YouTube watch history (JSON file from Google Takeout).',
      highlights: ['Secure upload', 'Privacy ensured'],
      // image: '/images/slide1.png',
      image: slide1
    },
    {
      title: 'AI-Powered Personality Analysis',
      description: 'Our intelligent system processes your watch patterns to understand your personality and preferences.',
      highlights: ['Behavioral insights', 'Intelligent analysis'],
      // image: '/images/slide2.png',
      image: slide2
    },
    {
      title: 'Receive Your Personality Profile',
      description: 'Get a detailed breakdown of your traits—creative, analytical, curious, etc.',
      highlights: ['Visual reports', 'Easy to understand'],
      // image: '/images/slide3.png',
      image: slide3
    },
    {
      title: 'Discover Career Paths Tailored to You',
      description: 'Based on your personality, we recommend career options that match your strengths.',
      highlights: ['Personalized', 'Strategic guidance'],
      // image: '/images/slide4.png',
      image: slide4
    },
    {
      title: 'Follow Your Learning Journey',
      description: 'Receive a custom roadmap with milestones and skills to learn for your career goal.',
      highlights: ['Step-by-step path', 'Skill progression'],
      // image: '/images/slide5.png',
      image: slide5
    },
    {
      title: 'Learn Through Curated YouTube Videos',
      description: 'Access hand-picked videos and playlists aligned with your career goal.',
      highlights: ['Time-saving', 'Quality content'],
      // image: '/images/slide6.png',
      image: slide6
    },
  ];

  return (
    <>
      <section id="howworks">
        <h2 className="text-center how-it-works-section-heading mt-3 mb-5">How It Works</h2>
        <Container className="mb-5 how-it-works-section">
        {/* indicators={false} removes the 3 dots */}
        <Carousel fade interval={3000} pause="hover" indicators={false}>
            {slides.map((slide, idx) => (
            <Carousel.Item key={idx}>
                <Row className="d-flex align-items-center justify-content-center flex-column flex-md-row p-4">
                <Col
                    md={6}
                    className={idx % 2 === 0 ? 'order-1' : 'order-md-2 order-1'}
                >
                    <img
                    src={slide.image}
                    alt={slide.title}
                    className="img-fluid rounded w-100"
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                </Col>
                <Col
                    md={6}
                    className={idx % 2 === 0 ? 'order-2' : 'order-md-1 order-2'}
                >
                    <div className="p-3 text-center text-md-start">
                    <h3 className="fw-bold">{slide.title}</h3>
                    <p>{slide.description}</p>
                    <ul>
                        {slide.highlights.map((point, i) => (
                        <li key={i}>{point}</li>
                        ))}
                    </ul>
                    </div>
                </Col>
                </Row>
            </Carousel.Item>
            ))}
            </Carousel>
        </Container>
        </section>
        </>
  );
};

export default HowItWorksCarousel;