
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import DonateForm from "./DonateForm";
import DonationSuccess from "./DonationSuccess";
import { UserData } from "@/utils/auth";

interface DonateTabProps {
  user: UserData;
}

const DonateTab: React.FC<DonateTabProps> = ({ user }) => {
  const [showForm, setShowForm] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  
  // Get the entity_id from the user object
  const entityId = user.entity_id || '';

  const handleNewDonation = () => {
    // Show iframe instead of the form
    setShowIframe(true);
  };
  
  const handleDonationSuccess = () => {
    setShowForm(false);
    setDonationSuccess(true);
  };

  const handleNewDonationAfterSuccess = () => {
    setDonationSuccess(false);
    setShowIframe(true);
  };

  return (
    <div className="p-6">
      {!showIframe && !donationSuccess && (
        <div className="text-center my-10">
          <h2 className="text-2xl font-bold text-medishare-blue mb-4">Donate Medicines</h2>
          <p className="max-w-lg mx-auto text-gray-600 mb-8">
            Your unused medicines can save lives. We ensure they reach those who need them most.
            Simply fill out the form, and our team will arrange for collection or drop-off.
          </p>
          <Button
            className="bg-medishare-orange hover:bg-medishare-gold text-white font-medium px-6 py-2"
            onClick={handleNewDonation}
          >
            Donate New Medicine
          </Button>
        </div>
      )}
      
      {showIframe && (
        <div className="w-full">
          <Button 
            variant="outline"
            className="mb-4"
            onClick={() => setShowIframe(false)}
          >
            ← Back
          </Button>
          <div className="w-full h-[calc(100vh-200px)] border rounded-md overflow-hidden">
            <iframe 
              src={`https://med-donor-dashboard-83.vercel.app?entity_id=${entityId}`}
              className="w-full h-full"
              title="Medicine Donation Form"
            >
              Loading donation form...
            </iframe>
          </div>
        </div>
      )}

      {showForm && !showIframe && !donationSuccess && (
        <DonateForm 
          donorEntityId={entityId}
          onSuccess={handleDonationSuccess}
        />
      )}

      {donationSuccess && (
        <DonationSuccess onDonateAnother={handleNewDonationAfterSuccess} />
      )}
    </div>
  );
};

export default DonateTab;
