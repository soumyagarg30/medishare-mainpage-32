
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NGOs = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-medishare-dark text-center mb-12">NGOs</h1>
          <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto mb-8">
            This page is under construction. Information about NGO partnerships will be available soon.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NGOs;
