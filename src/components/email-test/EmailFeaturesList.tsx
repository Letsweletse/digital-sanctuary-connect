
import React from 'react';

const EmailFeaturesList: React.FC = () => {
  return (
    <>
      <p className="mb-4 text-gray-600">
        Enter your email below to receive a test event registration confirmation with enhanced features:
      </p>
      <ul className="list-disc ml-5 mt-2 mb-4 text-gray-600">
        <li>Gate Gaborone logo in the header</li>
        <li>Higher resolution QR codes for location and check-in</li>
        <li>iCal calendar integration (.ics file)</li>
        <li>Multiple social media sharing options (WhatsApp, Facebook, Twitter, LinkedIn, Email)</li>
        <li>Gate Gaborone social media follow links</li>
        <li>Personalized check-in ID</li>
      </ul>
    </>
  );
};

export default EmailFeaturesList;
