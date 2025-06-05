
import React from 'react';
import { ExternalLink, MapPin } from 'lucide-react';

const LocationMap = () => {
  // Updated Google Maps URL for Travelodge Conference Centre
  const googleMapsUrl = "https://maps.app.goo.gl/Y5BPKfURyqQJ8EuXA";
  
  return (
    <div className="mt-8">
      <div className="rounded-xl overflow-hidden shadow-md border border-church-blue-light/20 hover:shadow-lg transition-shadow">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.8776341843986!2d25.910825315570043!3d-24.654020484267916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ebb5c8b9c7c7c7f%3A0x1234567890abcdef!2sTravelodge%20Conference%20Centre!5e0!3m2!1sen!2sbw!4v1692340450862!5m2!1sen!2sbw&markers=color:red%7C-24.654020484267916,25.910825315570043" 
          className="w-full h-72 md:h-80" 
          allowFullScreen 
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Travelodge Conference Centre Location"
        ></iframe>
      </div>
      <div className="mt-3 flex justify-center items-center">
        <a 
          href={googleMapsUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-church-blue hover:text-church-blue-dark transition-colors group"
        >
          <MapPin className="h-4 w-4" />
          <span className="font-medium underline-offset-2 group-hover:underline">View Travelodge Conference Centre in Google Maps</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
};

export default LocationMap;
