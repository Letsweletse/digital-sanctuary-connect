import { getSpeakerImage } from '@/components/media/utils/speakerImageUtils';

export const conferenceData = {
  title: "Perspectives on the Apostolic",
  dates: "Saturday, November 1, 2025",
  venue: "GATE Gaborone Auditorium , Gaborone",
  description: "Join us for Perspectives on the Apostolic with Thamo Naidoo, Presiding Apostolic Elder of Gate Global Family. Registration is compulsory. Refreshments provided, freewill offerings received.",
  image: "/lovable-uploads/poa-november-2025.jpeg",
  targetDate: new Date("2025-11-01T08:30:00"),
  sessions: [
    {
      id: "session1",
      day: "Saturday, November 1, 2025",
      time: "08:30 - 10:15",
      title: "Session 1",
      description: "Opening session with apostolic foundations",
      speakers: ["Thamo Naidoo"],
      location: "Cresta Lodge Gaborone"
    },
    {
      id: "session2",
      day: "Saturday, November 1, 2025",
      time: "10:45 - 12:00",
      title: "Session 2",
      description: "Deep dive into apostolic principles",
      speakers: ["Thamo Naidoo"],
      location: "Cresta Lodge Gaborone"
    },
    {
      id: "session3",
      day: "Saturday, November 1, 2025",
      time: "12:05 - 13:10",
      title: "Session 3",
      description: "Practical application and Q&A",
      speakers: ["Thamo Naidoo"],
      location: "Cresta Lodge Gaborone"
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
  id: "conf-2025",
  title: conferenceData.title,
  date: "2025-11-01",
  time: "08:30 - 13:10",
  location: conferenceData.venue,
  description: conferenceData.description,
  category: "conference" as const,
  image: conferenceData.image,
  registration: true
};
