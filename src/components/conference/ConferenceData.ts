import { getSpeakerImage } from '@/components/media/utils/speakerImageUtils';

export const conferenceData = {
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
      description: "",
      speakers: ["Pastor Kobus Bezuidenhout", "Thamo Naidoo"],
      location: "Main Auditorium"
    },
    {
      id: "day2-morning",
      day: "Friday, July 4",
      time: "08:30 - 13:30",
      title: "Morning Sessions 2-4",
      description: "",
      speakers: ["Pastor Kobus Bezuidenhout", "Thamo Naidoo", "James Mbugua"],
      location: "Main Auditorium"
    },
    {
      id: "day2-evening",
      day: "Friday, July 4",
      time: "18:00 - 20:30",
      title: "Evening Session 5",
      description: "",
      speakers: ["Pastor Kobus Bezuidenhout", "Thamo Naidoo"],
      location: "Main Auditorium"
    },
    {
      id: "day3-morning",
      day: "Saturday, July 5",
      time: "08:30 - 13:30",
      title: "Morning Sessions 6-8",
      description: "",
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
      bio: "Thamo Naidoo is a respected apostolic voice who travels globally teaching on apostolic reformation and kingdom principles. He is the founder of the Global Gate Family.",
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

export const conferenceEvent = {
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
