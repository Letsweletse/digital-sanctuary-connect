
import React from 'react';

const LocationMap = () => {
  return (
    <div className="mt-8">
      <div className="rounded-xl overflow-hidden shadow-md">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.364152127474!2d25.9048083!3d-24.6618567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ebf843b05f7aa07%3A0x2de14938d5996b9e!2sGaborone%20West%2C%20Phase%204%2C%20Plot%2054014%2C%20Gaborone%2C%20Botswana!5e0!3m2!1sen!2sus!4v1692340450862!5m2!1sen!2sus" 
          className="w-full h-72" 
          allowFullScreen 
          loading="lazy"
          title="Church Location"
        ></iframe>
      </div>
    </div>
  );
};

export default LocationMap;
