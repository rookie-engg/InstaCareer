// src/components/FeaturesSection.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaHistory, FaUserAlt, FaUserTie, FaYoutube, FaChartPie, FaRoute } from 'react-icons/fa';
import './css/FeaturesSection.css';

const features = [
  {
    icon: <FaHistory size={40} className="text-primary" />,
    title: "Watch History Analysis",
    description: "Analyze your YouTube watch history to understand your content interests and patterns."
  },
  {
    icon: <FaUserAlt size={40} className="text-info" />,
    title: "Personality Insight",
    description: "Get personality traits inferred from your behavior and video types."
  },
  {
    icon: <FaUserTie size={40} className="text-success" />,
    title: "Career Path Suggestion",
    description: "Receive recommended career paths based on your interests and personality type."
  },
  {
    icon: <FaYoutube size={40} className="text-danger" />,
    title: "Curated Learning Videos",
    description: "Get handpicked YouTube videos to learn and grow in your suggested career direction."
  },
  {
    icon: <FaChartPie size={40} className="text-warning" />,
    title: "Interactive Dashboard",
    description: "Visual charts showing your interests, patterns, and category breakdowns."
  },
  {
    icon: <FaRoute size={40} className="text-secondary" />,
    title: "Simple Guided Flow",
    description: "A clean and easy 5-step process from upload to insight, recommendation, and learning."
  }
];

const FeaturesSection = () => {
  return (
    <section id="features">
    <Container className="my-5 py-4">
      <h2 className="text-center mb-5 fw-bold section-heading">✨ Key Features</h2>
      <Row className="g-4">
      {features.map((feature, idx) => {
        let fadeClass =
          idx % 3 === 0
            ? "fade-in-left"
            : idx % 3 === 1
            ? "fade-in-up"
            : "fade-in-right";

        return (
          <Col md={6} lg={4} key={idx} className={fadeClass}>
            <Card
              className="h-100 shadow-sm border-0 text-center p-3 feature-card"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="mb-3">{feature.icon}</div>
              <Card.Title className="card-title">{feature.title}</Card.Title>
              <Card.Text className="card-text">{feature.description}</Card.Text>
            </Card>
          </Col>
        );
      })}
    </Row>
    </Container>
    </section>
  );
};

export default FeaturesSection;
