import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../components/css/style.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Registration successful!');
      // Handle API call or redirection here
    }
  };

  return (
    <section id='signup'>
    <div className="container">
      <div className="row full-height align-items-center">
        
        {/* SignUp Section */}
        <div className="col-md-6">
          <div className="login_container">
          <center><img src="/images/logo.png" alt="Career Path Logo" width="50" height="50" /></center>
            <h3 className="mb-4 mt-2 text-center">Sign Up</h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control custom-input"
                  placeholder="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <small className="text-danger">{errors.name}</small>}
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control custom-input"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control custom-input"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <small className="text-danger">{errors.password}</small>}
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control custom-input"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
              </div>

              <button type="submit" className="btn custom-btn w-100">Register</button>

              <div className="text-center">
                <p className="text-body-tertiary">Already have an account?
                <Link to="/login" className='text-decoration-none'>Login</Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Image Section */}
        <div className="col-md-6 image-container">
          <img src="/images/loginpage.jpg" alt="image not found..!!" />
        </div>
      </div>
    </div>
    </section>
  );
};

export default SignUp;
