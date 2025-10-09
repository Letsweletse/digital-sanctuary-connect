
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
          Perspectives on the Apostolic will be held at Gate Gaborone, Plot 54014, Gaborone West.
        </p>
        <LocationMap />
      </div>
    </div>
  );
};

export default ContactInfoSection;
