
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
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
        <ChatbotPreview />
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
          <p className="text-lg text-gray-600 mb-14">
            Our AI-powered platform enables efficient redistribution, optimizing the match 
            between surplus medicines and demand across multiple states.
          </p>
          <Link
            to="/about"
            className="inline-block bg-medishare-orange hover:bg-medishare-gold text-white font-medium px-8 py-4 rounded-md transition-colors duration-300 text-lg"
          >
            Learn More About Our Mission
          </Link>
        </div>
      </div>
    </section>
  );
};

const ChatbotPreview = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold text-medishare-dark mb-4">
            AI Assistant Now Available
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Need help navigating MediShare? Our AI assistant is here to help! Click the chat button in the bottom-right corner to get started.
          </p>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Key Features:</h3>
            <ul className="text-left max-w-md mx-auto space-y-2">
              <li className="flex items-start">
                <span className="bg-medishare-orange text-white rounded-full p-1 mr-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span>Voice interaction - speak directly to our assistant</span>
              </li>
              <li className="flex items-start">
                <span className="bg-medishare-orange text-white rounded-full p-1 mr-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span>Text-to-speech responses - listen to answers</span>
              </li>
              <li className="flex items-start">
                <span className="bg-medishare-orange text-white rounded-full p-1 mr-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span>Hybrid interaction - switch between text and voice</span>
              </li>
            </ul>
          </div>
          <p className="text-lg text-gray-600">
            Our AI assistant is available 24/7 to answer your questions about donations, NGO partnerships, 
            medicine availability, and more.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Index;
