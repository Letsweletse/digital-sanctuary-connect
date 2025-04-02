
import React from 'react';

const ChurchCalendarEmbed: React.FC = () => {
  return (
    <div className="mt-16 glass-panel p-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-church-neutral-900 mb-4">
          View Our Full Calendar
        </h3>
        <p className="text-church-neutral-700 max-w-2xl mx-auto">
          For a complete view of all church events, check out our interactive Google Calendar. 
          You can add it to your own calendar app to stay updated.
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="aspect-w-16 aspect-h-9">
          <iframe 
            src="https://calendar.google.com/calendar/embed?src=c_4f3888bef9b4fcdf367328fd4589754a7b1113b25c401c3c72be4a6fdc6c3ac1%40group.calendar.google.com&ctz=America%2FNew_York" 
            className="w-full h-96 rounded border-0"
            title="Church Calendar"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ChurchCalendarEmbed;
