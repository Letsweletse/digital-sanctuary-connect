
import React from 'react';
import { Clock, MapPin } from 'lucide-react';

interface Session {
  id: string;
  day: string;
  time: string;
  title: string;
  description: string;
  speakers: string[];
  location: string;
}

interface ConferenceScheduleProps {
  sessions: Session[];
}

const ConferenceSchedule: React.FC<ConferenceScheduleProps> = ({ sessions }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-church-blue-dark mb-4">Conference Schedule</h2>
      
      {sessions.map((session) => (
        <div key={session.id} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-church-gold">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-church-blue-dark">{session.title}</h3>
              <p className="text-church-neutral-600">{session.day}</p>
            </div>
            <div className="mt-2 md:mt-0 flex items-center text-church-blue font-medium">
              <Clock className="h-4 w-4 mr-1" />
              {session.time}
            </div>
          </div>
          
          <p className="text-church-neutral-700 mb-4">{session.description}</p>
          
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-church-neutral-500 mr-2" />
            <span className="text-church-neutral-600 text-sm">{session.location}</span>
          </div>
        </div>
      ))}
      
      <div className="bg-church-neutral-100 rounded-lg p-4 text-center text-church-neutral-700 text-sm">
        <p>Schedule subject to minor changes. Attendees will receive final schedule upon registration.</p>
      </div>
    </div>
  );
};

export default ConferenceSchedule;
