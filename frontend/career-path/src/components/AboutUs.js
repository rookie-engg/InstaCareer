import React from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import './css/aboutUs.css';
import aboutus from '../images/aboutus.png';
import anjum from '../images/anjum.jpg';
import shreya from '../images/shreya.jpg';
import vishal from '../images/vishal.jpg';
import shivam from '../images/shivam.png';
import sumit from '../images/sumit.jpg';

const AboutUs = () => {
  return (
    <section id="aboutus" className="aboutus-section">
      <Container>
        <div className="aboutus-overlay">
          <Row className="align-items-center">
            {/* Image on Left */}
            <Col md={6} className="mb-4 mb-md-0">
              <Image src={aboutus} alt="CareerPath AI Illustration" fluid className="rounded shadow-sm" />
            </Col>

            {/* Text on Right */}
            <Col md={6}>
              <h2 className="aboutus-title">About CareerPath</h2>
              <p className="aboutus-text">
                <strong>CareerPath</strong> is an AI-powered platform built to help individuals discover their ideal career path
                by analyzing their YouTube watch history and interests.
              </p>

              <p className="aboutus-text">
                We transform your digital behavior into a roadmap that reflects your personality and strengths — guiding
                you with personalized learning paths and career options backed by data.
              </p>

              <p className="aboutus-text">
                Our vision is to empower every learner with clarity, confidence, and direction in their professional journey.
              </p>

              {/* Team Section */}
              <div className='d-flex flex-column'>
                <h5 className="fw-bold mt-4 text-center">Our Team</h5>
                <div className="d-flex gap-4 mt-3 m-auto">
                  <div className="d-flex flex-column justify-content-center align-items-center text-center">
                    <Image src={shivam} className='' roundedCircle width="60" height="60" />
                    <p className="small mt-2 mb-0">Shivam</p>
                  </div>
                  <div className="d-flex flex-column justify-content-center align-items-center text-center">
                    <Image src={vishal} roundedCircle width="60" height="60" />
                    <p className="small mt-2 mb-0">Vishal</p>
                  </div>
                  <div className="d-flex flex-column justify-content-center align-items-center text-center">
                    <Image src={shreya} roundedCircle width="60" height="60" />
                    <p className="small mt-2 mb-0">Shreya</p>
                  </div>
                  <div className="d-flex flex-column justify-content-center align-items-center text-center">
                    <Image src={anjum} roundedCircle width="60" height="60" />
                    <p className="small mt-2 mb-0">Anjum</p>
                  </div>
                  <div className="d-flex flex-column justify-content-center align-items-center text-center">
                    <Image src={sumit} roundedCircle width="60" height="60" />
                    <p className="small mt-2 mb-0">Sumit</p>
                  </div>
                  {/* <div className="text-center">
                <Image src={test3} roundedCircle width="60" height="60" />
                <p className="small mt-2 mb-0">Sumit</p>
                
              </div> */}
                </div>
              </div>
              {/* CTA (Optional) */}
              <Button variant="primary" className="mt-4 rounded-pill px-4 shadow-sm">
                Learn More
              </Button>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
};

export default AboutUs;
