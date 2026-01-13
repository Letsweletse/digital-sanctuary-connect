import { getSpeakerImage } from '@/components/media/utils/speakerImageUtils';

export const conferenceData = {
  title: "Perspectives on the Apostolic",
  dates: "Saturday, 7 February 2026",
  venue: "GATE Gaborone Auditorium, Plot 54014, Gaborone West",
  description: "Join us for Perspectives on the Apostolic with Thamo Naidoo, Presiding Apostolic Elder of Gate Global Family. Registration is compulsory. Refreshments provided, freewill offerings received.",
  image: "/lovable-uploads/poa-february-2026.jpg",
  targetDate: new Date("2026-02-07T09:00:00"),
  sessions: [
    {
      id: "session1",
      day: "Saturday, 7 February 2026",
      time: "09:00 - 10:15",
      title: "Session 1",
      description: "Opening session with apostolic foundations",
      speakers: ["Thamo Naidoo"],
      location: "GATE Gaborone Auditorium"
    },
    {
      id: "session2",
      day: "Saturday, 7 February 2026",
      time: "10:45 - 12:00",
      title: "Session 2",
      description: "Deep dive into apostolic principles",
      speakers: ["Thamo Naidoo"],
      location: "GATE Gaborone Auditorium"
    },
    {
      id: "session3",
      day: "Saturday, 7 February 2026",
      time: "12:05 - 13:30",
      title: "Session 3",
      description: "Practical application and Q&A",
      speakers: ["Thamo Naidoo"],
      location: "GATE Gaborone Auditorium"
    }
  ],
  speakers: [
    {
      id: "thamo",
      name: "Thamo Naidoo",
      role: "Presiding Apostolic Elder, Gate Global Family",
      bio: "Thamo Naidoo is the Presiding Apostolic Elder of Gate Global Family. He is a respected apostolic voice who travels globally teaching on apostolic reformation and kingdom principles.",
      image: getSpeakerImage("Thamo Naidoo")
    }
  ]
};

export const conferenceEvent = {
  id: "conf-2026",
  title: conferenceData.title,
  date: "2026-02-07",
  time: "09:00 - 13:30",
  location: conferenceData.venue,
  description: conferenceData.description,
  category: "conference" as const,
  image: conferenceData.image,
  registration: true
};
