
import React from 'react';

const ConferenceOverview: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-church-blue-dark mb-4">Conference Overview</h2>
      
      <div className="prose max-w-none text-church-neutral-700">
        <p className="mb-4">
          Conference Overview: The "Apostolic Conference: Rule Your Domain" is a pivotal gathering designed to equip believers with the tools and understanding needed to establish apostolic governance in their respective spheres of influence.
        </p>
        
        <p className="mb-4">
          Over three power-packed days, participants will engage with apostolic teachings, practical workshops, and prophetic impartation sessions led by seasoned ministers including Pastor Kobus Bezuidenhout, Thamo Naidoo, and James Mbugua.
        </p>
        
        <h3 className="text-xl font-semibold text-church-blue-dark mt-6 mb-3">What to Expect:</h3>
        
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li>In-depth teaching on apostolic principles</li>
          <li>Practical workshops for different domains of influence</li>
          <li>Prophetic ministry and impartation</li>
          <li>Networking with like-minded believers</li>
          <li>Resources for continued growth</li>
        </ul>
        
        <p className="mb-4">
          This conference is designed for church leaders, ministers, and believers who are passionate about seeing the Kingdom of God established on earth as it is in heaven.
        </p>
        
        <p>
          Join us as we discover how to effectively rule our domains with the authority Christ has given us.
        </p>
      </div>
    </div>
  );
};

export default ConferenceOverview;
