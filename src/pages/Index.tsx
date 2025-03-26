
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Footer from "../components/Footer";

const Index = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Stats />
        <AboutPreview />
      </main>
      <Footer />
    </div>
  );
};

const AboutPreview = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold text-medishare-dark mb-4">About MediShare</h2>
          <p className="text-lg text-gray-600 mb-8">
            At MediShare, we bridge the gap between surplus medicines and those in need. 
            Every year, ₹15,000-₹18,000 crore worth of medicines go to waste in India, 
            while millions struggle to access essential healthcare.
          </p>
          <p className="text-lg text-gray-600 mb-12">
            Our AI-powered platform enables efficient redistribution, optimizing the match 
            between surplus medicines and demand across multiple states.
          </p>
          <a 
            href="/about" 
            className="inline-block bg-medishare-orange hover:bg-medishare-gold text-white font-medium px-6 py-3 rounded-md transition-colors duration-300"
          >
            Learn More About Our Mission
          </a>
        </div>
      </div>
    </section>
  );
};

export default Index;
