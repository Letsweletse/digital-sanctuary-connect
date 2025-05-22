
import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string | Date;
  eventTitle?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const EventCountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, eventTitle }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Function to calculate time left
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };
    
    // Calculate initially
    calculateTimeLeft();
    
    // Set up interval
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="w-full p-4 rounded-lg bg-gradient-to-br from-[#162035] to-[#24324b] shadow-lg border border-[#b8a156]/20">
      <div className="text-center mb-3">
        {eventTitle && (
          <h3 className="text-white/90 font-medium mb-1">{eventTitle}</h3>
        )}
        <div className="flex items-center justify-center text-[#b8a156] text-sm">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Event Countdown</span>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Minutes', value: timeLeft.minutes },
          { label: 'Seconds', value: timeLeft.seconds }
        ].map((item, index) => (
          <div key={index} className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">
              {String(item.value).padStart(2, '0')}
            </div>
            <div className="text-xs text-white/70 uppercase tracking-wider">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCountdownTimer;
