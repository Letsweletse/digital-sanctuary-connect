
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const EventCountdown = () => {
  // Example: Set target date for the next Sunday
  const getNextSunday = () => {
    const now = new Date();
    const daysUntilSunday = (7 - now.getDay()) % 7;
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + daysUntilSunday);
    nextSunday.setHours(9, 0, 0, 0); // 9:00 AM
    return nextSunday;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const targetDate = getNextSunday();
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);
  
  return (
    <section className="py-16 md:py-24 bg-church-neutral-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-church-gold-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
              Join Us This Sunday
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
              Next Service Countdown
            </h2>
            <p className="text-church-neutral-700">
              Our next service is happening soon. Mark your calendar and join us for a 
              time of worship, fellowship, and spiritual growth.
            </p>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item, index) => (
              <div key={index} className="glass-panel p-6 text-center">
                <div className="text-3xl md:text-5xl font-bold text-church-neutral-900 mb-2">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-sm text-church-neutral-600 uppercase tracking-wider">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <div className="mb-6 space-y-2">
              <p className="font-medium text-church-neutral-900">
                Sunday, {targetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at 9:00 AM
              </p>
              <p className="text-church-neutral-700">
                123 Faith Avenue, Grace City
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/events" className="btn-primary">
                View All Events
              </Link>
              <a href="#" className="btn-outline">
                Add to Calendar
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCountdown;
