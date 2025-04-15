
import React from 'react';

const LocationMap = () => {
  return (
    <div className="mt-8">
      <div className="rounded-xl overflow-hidden shadow-md border border-church-blue-light/20">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.364152127474!2d25.9048083!3d-24.6618567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ebf843b05f7aa07%3A0x2de14938d5996b9e!2sGate%20Gaborone!5e0!3m2!1sen!2sbw!4v1692340450862!5m2!1sen!2sbw" 
          className="w-full h-72 md:h-80" 
          allowFullScreen 
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Gate Gaborone Location"
        ></iframe>
      </div>
      <div className="mt-2 text-center">
        <a 
          href="https://maps.app.goo.gl/mVLNzv5R2T8wQZNt7" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-church-blue hover:text-church-blue-dark underline"
        >
          View in Google Maps
        </a>
      </div>
    </div>
  );
};

export default LocationMap;
