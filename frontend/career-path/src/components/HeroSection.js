import './css/HeroSection.css';

const HeroSection = () => {
  return (
    <>
    <section id = "heroSection">
      <div className="hero-container d-flex align-items-center justify-content-center">
        <div className="container text-center">
          <h1 className="display-1 fw-bold gradient-text hero-heading animate-slide-down">
            Discover Your Career Path
          </h1>
          <p className="lead fs-3 fw-semibold gradient-text hero-subheading animate-slide-right">
            Analyze your Interests. Unlock your dream career.
          </p>
          <button className="btn btn-primary btn-lg mt-3 gradient-button animate-slide-left">
            Get Started
          </button>
        </div>
      </div>
      </section>
    </>
  );
};

export default HeroSection;
