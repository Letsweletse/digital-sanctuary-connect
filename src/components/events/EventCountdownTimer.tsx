
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

const EventCountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
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
    <div className="w-full p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-[#162035] to-[#24324b] shadow-2xl border border-[#b8a156]/30">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center text-[#b8a156] text-lg mb-2">
          <Calendar className="h-6 w-6 mr-2" />
          <span className="font-semibold">Event Countdown</span>
        </div>
        <div className="text-white/70 text-sm">Don't miss out on this transformative experience</div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Minutes', value: timeLeft.minutes },
          { label: 'Seconds', value: timeLeft.seconds }
        ].map((item, index) => (
          <div key={index} className="bg-white/10 rounded-xl p-4 lg:p-6 backdrop-blur-sm border border-[#b8a156]/20">
            <div className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2">
              {String(item.value).padStart(2, '0')}
            </div>
            <div className="text-sm lg:text-base text-white/70 uppercase tracking-wider font-medium">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCountdownTimer;
