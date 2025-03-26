
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-medishare-dark text-center mb-8">About Us</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
              <p className="text-gray-700 text-lg mb-8">
                At MediiShare, we are on a mission to bridge the gap between surplus medicine and those in need. 
                Every year, ₹15,000-₹18,000 crore worth of medicines go to waste in India, while over 190 million 
                people struggle to access essential healthcare.
              </p>
              
              <h3 className="text-xl font-display font-semibold text-medishare-blue mb-4">The Problem</h3>
              <p className="text-gray-700 mb-8">
                Nearly 50% of prescribed medicines go unused, leading to expiration, financial loss, and environmental harm. 
                Improper disposal results in pharmaceutical contamination, affecting over 70% of water bodies worldwide.
              </p>
              
              <h3 className="text-xl font-display font-semibold text-medishare-blue mb-4">Our Solution</h3>
              <p className="text-gray-700 mb-6">
                MediShare is an AI-powered platform that enables hospitals and pharmacies to donate surplus medicines, 
                connects them with verified NGOs and recipient institutions, and ensures efficient redistribution.
              </p>
              
              <ul className="list-disc pl-6 space-y-3 mb-8">
                <li className="text-gray-700">
                  <span className="font-semibold text-medishare-dark">AI-Powered Matching:</span> Our system intelligently 
                  pairs surplus medicines with demand, optimizing distribution across multiple states.
                </li>
                <li className="text-gray-700">
                  <span className="font-semibold text-medishare-dark">OCR-Based Verification:</span> Automated extraction 
                  of medicine details ensures 99% accuracy and reduces manual effort by 80%.
                </li>
                <li className="text-gray-700">
                  <span className="font-semibold text-medishare-dark">Secure & Compliant:</span> We partner with 100+ 
                  verified organizations to ensure safe handling and delivery.
                </li>
              </ul>
              
              <h3 className="text-xl font-display font-semibold text-medishare-blue mb-4">Our Impact</h3>
              <p className="text-gray-700">
                By reducing waste and improving access, we aim to save millions in healthcare costs and provide 
                life-saving medicines to over 10 million underserved individuals annually.
              </p>
              
              <div className="mt-10 text-center">
                <Link 
                  to="/sign-in" 
                  className="inline-block bg-medishare-orange hover:bg-medishare-gold text-white font-medium px-6 py-3 rounded-md transition-colors duration-300 mt-4"
                >
                  Join us in transforming surplus into life-saving solutions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const Link = ({ to, className, children }) => (
  <a 
    href={to} 
    className={className}
  >
    {children}
  </a>
);

export default About;
