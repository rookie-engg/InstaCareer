// Import required packages
import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Ananya, CS Student',
      text: '"This platform helped me identify a career path I never considered. The insights were spot-on!"',
      avatar: '/images/test1.png',
    },
    {
      name: 'Rajesh, Aspiring Developer',
      text: '"The AI analysis from my YouTube watch history was surprisingly accurate. Loved the learning roadmap!"',
      avatar: '/images/test2.png',
    },
    {
      name: 'Fatima, Graduate',
      text: '"Very clean UI and smooth experience. I instantly got a direction with learning videos to start with."',
      avatar: '/images/test3.png',
    },
  ];

  return (
    <section className="bg-light py-5">
      <Container>
      <h2 className="testimonials-heading">What Our Users Say</h2>
        <Row className="g-4">
          {testimonials.map((testimonial, idx) => (
            <Col md={4} key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
              >
                <Card className="h-100 shadow-lg border-0 p-3">
                  <div className="d-flex align-items-center mb-3">
                    <Image
                      src={testimonial.avatar}
                      roundedCircle
                      width={50}
                      height={50}
                      alt={testimonial.name}
                      className="me-3"
                    />
                    <Card.Title className="mb-0 fs-6 text-secondary">{testimonial.name}</Card.Title>
                  </div>
                  <Card.Body className="pt-0">
                  <Card.Text className="testimonial-text">{testimonial.text}</Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Testimonials;
