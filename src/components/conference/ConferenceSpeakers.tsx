import React from 'react';
interface Speaker {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}
interface ConferenceSpeakersProps {
  speakers: Speaker[];
}
const ConferenceSpeakers: React.FC<ConferenceSpeakersProps> = ({
  speakers
}) => {
  return <div className="space-y-8">
      <h2 className="text-2xl font-bold text-church-blue-dark mb-4">Conference Speakers</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {speakers.map(speaker => <div key={speaker.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="h-64 overflow-hidden">
              <img src={speaker.image} alt={speaker.name} className="w-full h-full object-center object-contain" />
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-church-blue-dark">{speaker.name}</h3>
              <p className="text-church-gold font-medium mb-3">{speaker.role}</p>
              <p className="text-church-neutral-700">{speaker.bio}</p>
            </div>
          </div>)}
      </div>
    </div>;
};
export default ConferenceSpeakers;