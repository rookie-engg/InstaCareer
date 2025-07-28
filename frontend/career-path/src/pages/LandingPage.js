import AboutUs from '../components/AboutUs.js';
import HowItWorksCarousel from '../components/Carousel.js';
import ContactUs from '../components/ContactUs.js';
import FeaturesSection from '../components/FeaturesSection.js';
import Footer from '../components/Footer.js';
import HeroSection from '../components/HeroSection.js';
import Navbar from '../components/Navbar.js';
import Testimonials from '../components/Testimonials.js';

export default function LandingPage(){
    return(
        <>
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksCarousel />
        <Testimonials />
        <AboutUs />
        <ContactUs />
        <Footer />
        </>
    );
}