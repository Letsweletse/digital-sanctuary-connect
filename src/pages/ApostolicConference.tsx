
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, MapPin, Users, BadgeDollarSign, Star, Crown } from 'lucide-react';
import { useEventRegistration } from '@/hooks/useEventRegistration';
import EventCountdownTimer from '@/components/events/EventCountdownTimer';

const ApostolicConference = () => {
  const { handleOpenRegistration } = useEventRegistration();

  // Add meta tags for social media sharing
  useEffect(() => {
    // Set page title
    document.title = "Apostolic Conference: Rule Your Domain | Gate Gaborone";
    
    // Add meta tags for social sharing
    const metaTags = [
      { property: 'og:title', content: 'Apostolic Conference: Rule Your Domain' },
      { property: 'og:description', content: 'Join us July 3-5, 2025 at Travelodge Conference Centre for this transformative apostolic conference. Register now for P250.' },
      { property: 'og:image', content: `${window.location.origin}/lovable-uploads/6f1ed145-0434-4105-81e3-81bed7ee143a.png` },
      { property: 'og:url', content: window.location.href },
      { property: 'og:type', content: 'event' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Apostolic Conference: Rule Your Domain' },
      { name: 'twitter:description', content: 'Join us July 3-5, 2025 at Travelodge Conference Centre for this transformative apostolic conference.' },
      { name: 'twitter:image', content: `${window.location.origin}/lovable-uploads/6f1ed145-0434-4105-81e3-81bed7ee143a.png` }
    ];

    metaTags.forEach(tag => {
      const existingTag = document.querySelector(`meta[${tag.property ? 'property' : 'name'}="${tag.property || tag.name}"]`);
      if (existingTag) {
        existingTag.setAttribute('content', tag.content);
      } else {
        const meta = document.createElement('meta');
        if (tag.property) {
          meta.setAttribute('property', tag.property);
        } else {
          meta.setAttribute('name', tag.name);
        }
        meta.setAttribute('content', tag.content);
        document.head.appendChild(meta);
      }
    });

    // Cleanup function to remove meta tags when component unmounts
    return () => {
      metaTags.forEach(tag => {
        const existingTag = document.querySelector(`meta[${tag.property ? 'property' : 'name'}="${tag.property || tag.name}"]`);
        if (existingTag) {
          existingTag.remove();
        }
      });
    };
  }, []);

  const conferenceEvent = {
    id: '5',
    title: 'Apostolic Conference: Rule Your Domain',
    date: '2025-07-03',
    endDate: '2025-07-05',
    time: '• Thursday Evening: Session 1 (18:00–20:30)\n• Friday Morning: Sessions 2–4 (08:30–13:30)\n• Friday Evening: Session 5 (18:00–20:30)\n• Saturday Morning: Sessions 6–8 (08:30–13:30)',
    location: 'Travelodge Conference Centre',
    description: 'Join us for this transformative conference as we explore apostolic principles for ruling your domain. This three-day event features powerful teaching, workshops, and fellowship opportunities.',
    category: 'conference',
    image: '/lovable-uploads/6f1ed145-0434-4105-81e3-81bed7ee143a.png',
    registration: true,
    registrationLink: '/apostolic-conference'
  };

  const openRegistration = () => {
    handleOpenRegistration(conferenceEvent);
  };

  const getTargetDate = () => {
    return new Date('2025-07-03T18:00:00Z');
  };

  const shareOnWhatsApp = () => {
    const message = `🎉 *Apostolic Conference: Rule Your Domain*\n\n📅 July 3-5, 2025\n📍 Travelodge Conference Centre, Gaborone\n💰 Registration: P250\n\nJoin us for this transformative conference! Register now:\n${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#24324b] to-[#2d3e5a] text-white">
      {/* Premium Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-church-blue via-church-blue-dark to-purple-900">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
              alt="Conference Background" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center py-16 px-8"
        >
          <div className="flex items-center justify-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative"
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mr-6 shadow-2xl border-4 border-church-gold">
                <Crown className="h-10 w-10 text-church-blue" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-church-gold rounded-full flex items-center justify-center shadow-lg"
              >
                <Star className="h-3 w-3 text-white" />
              </motion.div>
            </motion.div>

            <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight">
                Gate Gaborone
              </h1>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-church-gold" />
                <span className="text-church-gold font-semibold text-lg">Premium Conference Experience</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Apostolic Conference: Rule Your Domain
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8 text-white/90">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-church-gold rounded-full"></div>
                <span className="text-xl">July 3-5, 2025</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-church-gold rounded-full"></div>
                <span className="text-xl">Travelodge Conference Centre</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Countdown Timer */}
      <div className="py-8 px-4">
        <EventCountdownTimer targetDate={getTargetDate()} />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-[#b8a156]/20">
            <div className="flex flex-col lg:flex-row">
              {/* Conference Image */}
              <div className="lg:w-1/2">
                <div className="aspect-[4/3] lg:aspect-auto lg:h-[600px] w-full">
                  <img
                    src={conferenceEvent.image}
                    alt={conferenceEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Event Details */}
              <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center text-white/90 bg-white/5 rounded-lg p-4">
                      <CalendarDays className="h-6 w-6 mr-3 text-[#b8a156] flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm text-[#b8a156]">Date</div>
                        <div className="font-semibold text-lg">July 3-5, 2025</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-white/90 bg-white/5 rounded-lg p-4">
                      <MapPin className="h-6 w-6 mr-3 text-[#b8a156] flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm text-[#b8a156]">Venue</div>
                        <div className="font-semibold text-lg">{conferenceEvent.location}</div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Clock className="h-6 w-6 mr-3 text-[#b8a156]" />
                      <span className="font-semibold text-[#b8a156] text-lg">Conference Schedule</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-6 space-y-3">
                      {conferenceEvent.time.split('\n').map((timeSlot, index) => (
                        <div key={index} className="text-white/90 font-medium text-lg">
                          {timeSlot}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Registration Fee */}
                  <div className="bg-gradient-to-r from-[#b8a156]/20 to-[#d4c278]/20 border border-[#b8a156]/30 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BadgeDollarSign className="h-8 w-8 mr-4 text-[#b8a156]" />
                        <div>
                          <div className="font-semibold text-white text-xl">Registration Fee</div>
                          <div className="text-white/80">Per person (catering purposes)</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[#b8a156]">P250</div>
                        <div className="text-white/70 text-sm">Botswana Pula</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-white/90 text-lg leading-relaxed">
                    {conferenceEvent.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={openRegistration}
                      className="bg-gradient-to-r from-[#b8a156] to-[#d4c278] hover:from-[#d4c278] hover:to-[#b8a156] text-white px-8 py-6 text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border-0 rounded-lg"
                    >
                      <Users className="h-6 w-6 mr-3" />
                      Register Now - P250
                    </Button>
                    
                    <Button
                      onClick={shareOnWhatsApp}
                      variant="outline"
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-6 text-lg border-2 border-green-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Share on WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApostolicConference;
