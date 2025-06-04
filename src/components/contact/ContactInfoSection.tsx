
import React from 'react';
import ContactInfoPanel from './ContactInfoPanel';
import LocationMap from './LocationMap';

const ContactInfoSection = () => {
  return (
    <div className="flex flex-col space-y-8 animate-fadeIn">
      <ContactInfoPanel />
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-church-neutral-800">Conference Location</h3>
        <p className="text-church-neutral-600">
          The Apostolic Conference: Rule Your Domain will be held at Travelodge Conference Centre, Gaborone.
        </p>
        <LocationMap />
      </div>
    </div>
  );
};

export default ContactInfoSection;
