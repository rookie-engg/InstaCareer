import React from 'react';
import './css/ContactUs.css';

const ContactUs = () => {
  return (
    <section className="contact-section py-5" id="contact">
      <div className="container">
        <h2 className="contact-heading text-center mb-5">Get in Touch</h2>
        <div className="row align-items-center">
          
          {/* Right Side Form */}
          <div className="col-md-6">
            <div className="contact-form-box p-4 shadow">
              <form>
                <div className="mb-3">
                  <label htmlFor="formName" className="form-label">Your Name</label>
                  <input type="text" className="form-control" id="formName" placeholder="Enter your name" />
                </div>

                <div className="mb-3">
                  <label htmlFor="formEmail" className="form-label">Email address</label>
                  <input type="email" className="form-control" id="formEmail" placeholder="Enter your email" />
                </div>

                <div className="mb-4">
                  <label htmlFor="formMessage" className="form-label">Message</label>
                  <textarea className="form-control" id="formMessage" rows="4" placeholder="Write your message"></textarea>
                </div>

                <button type="submit" className="btn gradient-button w-100">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Left Side Image */}
          <div className="col-md-6 mb-4 mb-md-0">
            <div className="contact-image">
              <img
                src="/images/contact.png" // replace with your actual image path
                alt="Contact Us Illustration"
                className="img-fluid rounded"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactUs;
