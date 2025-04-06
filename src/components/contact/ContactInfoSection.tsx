
import React from 'react';
import ContactInfoPanel from './ContactInfoPanel';
import LocationMap from './LocationMap';

const ContactInfoSection = () => {
  return (
    <div className="flex flex-col space-y-8 animate-fadeIn">
      <ContactInfoPanel />
      <LocationMap />
    </div>
  );
};

export default ContactInfoSection;
