
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Clock, MapPin, User, Users } from 'lucide-react';
import EventCountdownTimer from '@/components/events/EventCountdownTimer';
import { Button } from '@/components/ui/button';
import { useEventRegistration } from '@/hooks/useEventRegistration';
import { getSpeakerImage } from '@/components/media/utils/speakerImageUtils';

// Define the conference data
const conferenceData = {
  title: "Apostolic Conference: Rule Your Domain",
  dates: "July 3-5, 2025",
  venue: "Travelodge Conference Centre",
  description: "Join us for this transformative conference as we explore apostolic principles for ruling your domain. This three-day event features powerful teaching, workshops, and fellowship opportunities.",
  image: "/lovable-uploads/919c482f-8402-410d-933a-3dba7156a457.png",
  targetDate: new Date("2025-07-03T18:00:00"),
  sessions: [
    {
      id: "day1-evening",
      day: "Thursday, July 3",
      time: "18:00 - 20:30",
      title: "Evening Session 1",
      description: "Opening session with worship and keynote message on apostolic foundations.",
      speakers: ["Pastor Kobus Bezuidenhout", "Thamo Naidoo"],
      location: "Main Auditorium"
    },
    {
      id: "day2-morning",
      day: "Friday, July 4",
      time: "08:30 - 13:30",
      title: "Morning Sessions 2-4",
      description: "Morning workshops on practical application of apostolic principles in different domains.",
      speakers: ["Pastor Kobus Bezuidenhout", "Thamo Naidoo", "James Mbugua"],
      location: "Main Auditorium & Breakout Rooms"
    },
    {
      id: "day2-evening",
      day: "Friday, July 4",
      time: "18:00 - 20:30",
      title: "Evening Session 5",
      description: "Prophetic impartation and ministry session.",
      speakers: ["Pastor Kobus Bezuidenhout", "Thamo Naidoo"],
      location: "Main Auditorium"
    },
    {
      id: "day3-morning",
      day: "Saturday, July 5",
      time: "08:30 - 13:30",
      title: "Morning Sessions 6-8",
      description: "Final sessions with commissioning and closing ceremony.",
      speakers: ["Pastor Kobus Bezuidenhout", "Thamo Naidoo", "James Mbugua"],
      location: "Main Auditorium"
    }
  ],
  speakers: [
    {
      id: "kobus",
      name: "Pastor Kobus Bezuidenhout",
      role: "Senior Pastor, Gate Gaborone",
      bio: "Pastor Kobus Bezuidenhout is the Senior Pastor of Gate Gaborone. He has been instrumental in establishing apostolic centers across Botswana and beyond.",
      image: getSpeakerImage("Pastor Kobus Bezuidenhout")
    },
    {
      id: "thamo",
      name: "Thamo Naidoo",
      role: "Apostolic Voice, Global Speaker",
      bio: "Thamo Naidoo is a respected apostolic voice who travels globally teaching on apostolic reformation and kingdom principles. He is the founder of the Global Gate movement.",
      image: getSpeakerImage("Thamo Naidoo")
    },
    {
      id: "james",
      name: "James Mbugua",
      role: "Apostolic Leader, Kenya",
      bio: "James Mbugua is an apostolic leader from Kenya with extensive experience in church planting and leadership development across East Africa.",
      image: getSpeakerImage("James Mbugua")
    }
  ]
};

// Convert this to an EventData object for registration
const conferenceEvent = {
  id: "conf-2025",
  title: conferenceData.title,
  date: "2025-07-03",
  endDate: "2025-07-05",
  time: "Multiple Sessions",
  location: conferenceData.venue,
  description: conferenceData.description,
  category: "conference" as const,
  image: conferenceData.image,
  registration: true
};

const Conference = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const {
    isRegistrationOpen,
    currentEvent,
    formData,
    isSubmitting,
    handleOpenRegistration,
    handleCloseRegistration,
    handleInputChange,
    handleSubmitRegistration
  } = useEventRegistration();
  
  const openRegistration = () => {
    handleOpenRegistration(conferenceEvent);
  };
  
  return (
    <Layout>
      <main className="flex-grow bg-church-neutral-50">
        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-church-blue-dark/70 to-church-blue-dark/70 z-10"></div>
          <div className="w-full h-72 md:h-96 bg-church-blue bg-cover bg-center" style={{ backgroundImage: `url(${conferenceData.image})` }}></div>
          
          <div className="container mx-auto px-4 relative z-20 -mt-32 md:-mt-40">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 md:p-8">
                <h1 className="text-2xl md:text-4xl font-bold text-church-blue-dark mb-4">{conferenceData.title}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center text-church-neutral-700">
                    <CalendarDays className="h-5 w-5 mr-2 text-church-blue" />
                    <span>{conferenceData.dates}</span>
                  </div>
                  
                  <div className="flex items-center text-church-neutral-700">
                    <Clock className="h-5 w-5 mr-2 text-church-blue" />
                    <span>Multiple Sessions</span>
                  </div>
                  
                  <div className="flex items-center text-church-neutral-700">
                    <MapPin className="h-5 w-5 mr-2 text-church-blue" />
                    <span>{conferenceData.venue}</span>
                  </div>
                </div>
                
                <p className="text-church-neutral-700 mb-6">{conferenceData.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Button 
                      className="w-full bg-church-gold hover:bg-church-gold-dark text-white"
                      onClick={openRegistration}
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Register Now
                    </Button>
                  </div>
                  
                  <div>
                    <Button 
                      variant="outline" 
                      className="w-full border-church-blue text-church-blue"
                      onClick={() => window.open("https://calendar.google.com/calendar/render?action=TEMPLATE&text=Apostolic%20Conference:%20Rule%20Your%20Domain&dates=20250703T180000/20250705T133000&details=Join%20us%20for%20this%20transformative%20conference%20as%20we%20explore%20apostolic%20principles%20for%20ruling%20your%20domain.&location=Travelodge%20Conference%20Centre,%20Gaborone&sprop=&sprop=name:", "_blank")}
                    >
                      Add to Calendar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Countdown Timer */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <EventCountdownTimer 
              targetDate={conferenceData.targetDate} 
              eventTitle={conferenceData.title}
            />
          </div>
        </div>
        
        {/* Content Tabs */}
        <div className="container mx-auto px-4 py-8 pb-16">
          <Tabs defaultValue="overview" className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="speakers">Speakers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-church-blue-dark mb-4">Conference Overview</h2>
              
              <div className="prose max-w-none text-church-neutral-700">
                <p className="mb-4">
                  The "Apostolic Conference: Rule Your Domain" is a pivotal gathering designed to equip believers with the tools and understanding needed to establish apostolic governance in their respective spheres of influence.
                </p>
                
                <p className="mb-4">
                  Over three power-packed days, participants will engage with apostolic teachings, practical workshops, and prophetic impartation sessions led by seasoned ministers including Pastor Kobus Bezuidenhout, Dr. Thamo Naidoo, and James Mbugua.
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
                
                <div className="bg-church-blue-light/20 border-l-4 border-church-blue p-4 rounded my-6">
                  <p className="font-medium text-church-blue-dark">
                    "And I will give you the keys of the kingdom of heaven, and whatever you bind on earth will be bound in heaven, and whatever you loose on earth will be loosed in heaven." - Matthew 16:19
                  </p>
                </div>
                
                <p>
                  Join us as we discover how to effectively rule our domains with the authority Christ has given us.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule" className="space-y-6">
              <h2 className="text-2xl font-bold text-church-blue-dark mb-4">Conference Schedule</h2>
              
              {conferenceData.sessions.map((session) => (
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
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-church-neutral-500 mr-2" />
                      <span className="text-church-neutral-600 text-sm">
                        Speakers: {session.speakers.join(", ")}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-church-neutral-500 mr-2" />
                      <span className="text-church-neutral-600 text-sm">{session.location}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="bg-church-neutral-100 rounded-lg p-4 text-center text-church-neutral-700 text-sm">
                <p>Schedule subject to minor changes. Attendees will receive final schedule upon registration.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="speakers" className="space-y-8">
              <h2 className="text-2xl font-bold text-church-blue-dark mb-4">Conference Speakers</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {conferenceData.speakers.map((speaker) => (
                  <div key={speaker.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                    <div className="h-64 overflow-hidden">
                      <img 
                        src={speaker.image} 
                        alt={speaker.name} 
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-church-blue-dark">{speaker.name}</h3>
                      <p className="text-church-gold font-medium mb-3">{speaker.role}</p>
                      <p className="text-church-neutral-700">{speaker.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-church-blue-light/10 rounded-lg p-6 border border-church-blue-light/30">
                <h3 className="text-lg font-semibold text-church-blue-dark mb-2">Additional Guest Speakers</h3>
                <p className="text-church-neutral-700">
                  More guest speakers will be announced as we get closer to the conference date. 
                  Register now to receive updates on additional speakers and session details.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </Layout>
  );
};

export default Conference;
