// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import '../components/css/style.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      alert('Form submitted successfully!');
      // Proceed with API call or further logic
      navigate('/upload');


    }
  };




  return (
    <section id='login'>
    <div className="container">
      <div className="row full-height align-items-center">
        
        {/* Login Section */}
        <div className="col-md-6">
          <div className="login_container">
         <center><img src="/images/logo.png" alt="Career Path Logo" width="50" height="50" /></center>
            <h3 className="mb-4 mt-2 text-center">Login</h3>

            <form onSubmit={handleSubmit}>
              <div className="google-btn">
                <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google Logo" />
                Sign in with Google
              </div>

              <p className="text-body-tertiary text-center">Or sign in with email</p>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control custom-input"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control custom-input"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <small className="text-danger">{errors.password}</small>}
              </div>

              <div className="row mb-3 align-items-center">
             

                <div className="col-6">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="defaultCheck1" />
                    <label className="form-check-label fw-light fs-6 text-body-tertiary" htmlFor="defaultCheck1">
                      Keep me logged in
                    </label>
                  </div>
                </div>

                <div className="col-6 text-end">
                  <Link to="/forgot-password" className='text-decoration-none'>Forgot password?</Link>
                </div>
              </div>

              <button type="submit" className="btn custom-btn w-100">Login</button>

              <div className="text-center">
                <p className="text-body-tertiary">Don't have an account?
                  <Link to="/signup" className='text-decoration-none'>Sign up</Link>

                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Image Section */}
        
        <div className="col-md-6 image-container">
        <img src="/images/loginpage.jpg" alt="Login Visual" />
        </div>
      </div>
    </div>
    </section>
  );
};

export default Login;
