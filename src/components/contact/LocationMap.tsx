import React from 'react';
import { ExternalLink, MapPin } from 'lucide-react';

const LocationMap = () => {
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=-24.6533978%2C25.7800975";
  
  return (
    <div className="mt-8">
      <div className="rounded-xl overflow-hidden shadow-md border border-church-blue-light/20 hover:shadow-lg transition-shadow">
        <iframe
          src="https://www.google.com/maps?q=-24.6533978,25.7800975&z=17&output=embed"
          className="w-full h-72 md:h-80"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ditlhareng Estate, Gabane Location"
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
          <span className="font-medium underline-offset-2 group-hover:underline">Get directions to Ditlhareng Estate, Gabane</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
};

export default LocationMap;
