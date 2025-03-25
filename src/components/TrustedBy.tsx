
import React from "react";
import { Button } from "@/components/ui/button";

const TrustedBy = () => {
  return (
    <section className="bg-medishare-dark/5 py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-6">
              <img
                src="/lovable-uploads/45a81f67-90b3-43d3-9499-2a874a4d48be.png"
                alt="MediShare Logo"
                className="h-20 w-auto"
              />
            </div>
            <h3 className="text-xl font-display font-bold text-medishare-dark mb-2">MediShare</h3>
            <p className="text-sm text-gray-600 max-w-xs">
              Recycle. Reuse. Relieve – Giving Medicines a Second Life
            </p>
          </div>

          <div className="flex flex-col">
            <h3 className="text-2xl font-display font-bold text-medishare-dark mb-6 text-center lg:text-left">
              Trusted By
            </h3>
            <ul className="space-y-4 text-medishare-blue">
              <li className="hover:text-medishare-orange transition-colors duration-300 text-center lg:text-left">
                Kerala Foundation
              </li>
              <li className="hover:text-medishare-orange transition-colors duration-300 text-center lg:text-left">
                Uday Foundation
              </li>
              <li className="hover:text-medishare-orange transition-colors duration-300 text-center lg:text-left">
                ABC Pharma
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center lg:items-end">
            <h3 className="text-2xl font-display font-bold text-medishare-dark mb-4 text-center lg:text-right">
              Secure Your Dose
            </h3>
            <p className="text-gray-600 mb-6 text-center lg:text-right">
              Get started on your journey and book your medicines here
            </p>
            <Button 
              className="bg-medishare-blue hover:bg-medishare-dark text-white font-medium px-6 py-2 rounded-md transition-all duration-300"
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
