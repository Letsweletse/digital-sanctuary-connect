export const SITE = {
  name: 'Gate Gaborone',
  tagline: 'Reach · Resource · Reform',
  description:
    'An apostolic centre in the heart of Botswana’s economic capital, strategically positioned to align with biblical patterns and model the Kingdom of God.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://gategaborone.co.bw',
  address: ['Gate Gaborone Auditorium', 'Gaborone West, Phase 4, Plot 54014', 'Gaborone, Botswana'],
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Gate+Gaborone+Plot+54014+Gaborone+West',
  phoneOffice: '+267 350 0194',
  phoneAfterHours: '+267 7550 7981',
  email: 'info@gategaborone.co.bw',
  youtube: 'https://www.youtube.com/@gategaboronebotswana2702',
  facebook: 'https://www.facebook.com/profile.php?id=61575319345710',
  services: [
    { day: 'Sunday', name: 'Sunday Services', time: '8:30 AM & 11:00 AM', where: 'Gate Gaborone Auditorium' },
    { day: 'Wednesday', name: 'House Church', time: '6:30 PM – 8:00 PM', where: 'Homes across Gaborone' },
  ],
};

export const VALUES = [
  'Biblical teaching and spiritual growth',
  'Authentic community and relationships',
  'Passionate worship and prayer',
  'Compassionate service and outreach',
  'Excellence and integrity in all we do',
];

export type Leader = { name: string; role: string; group: 'Senior Pastor' | 'Pastors' | 'Church Elders'; img: string; bio: string };
export const LEADERS: Leader[] = [
  { name: 'Pastor Kobus Bezuidenhout', role: 'Senior Pastor', group: 'Senior Pastor', img: '/img/kobus-portrait.jpg',
    bio: 'Pastor Kobus Bezuidenhout, our Senior Pastor, has been fathering our community for over 15 years with wisdom and grace.' },
  { name: 'Pastor Oteng & Carry Leepile', role: 'Pastors', group: 'Pastors', img: '/img/oteng-carry-leepile.jpg',
    bio: 'Pastor Oteng and Carry Leepile serve our congregation with passion and dedication, bringing spiritual guidance and leadership.' },
  { name: 'Pastor Cynthia Harman', role: 'Pastor', group: 'Pastors', img: '/img/cynthia-harman.jpg',
    bio: 'Pastor Cynthia Harman brings a dynamic and inspiring approach to ministry, serving our congregation with grace and wisdom.' },
  { name: 'Peter & Naomi Taylor', role: 'Church Elders', group: 'Church Elders', img: '/img/peter-naomi-taylor.jpg',
    bio: 'Peter and Naomi serve with grace and dedication, bringing years of pastoral care experience to our congregation.' },
  { name: 'Thabiso & Lesogo Thwane', role: 'Church Elders', group: 'Church Elders', img: '/img/thabiso-lesogo-thwane.jpg',
    bio: 'Thabiso and Lesogo serve with grace and dedication, bringing years of pastoral care experience to our congregation.' },
  { name: 'Dave & Monica Fischer', role: 'Church Elders', group: 'Church Elders', img: '/img/dave-monica-fischer.jpg',
    bio: 'Dave and Monica Fischer serve with compassion and wisdom, bringing deep spiritual insight to our congregation.' },
];

export const HOUSE_CHURCHES = [
  { hosts: 'Oteng & Carryadah Leepile', area: 'Block 5', blurb: 'Fellowship, prayer and Bible study in a welcoming home in Block 5.' },
  { hosts: 'Peter & Naomi Taylor', area: 'Gabane', blurb: 'Community and spiritual growth in our house church in Gabane.' },
  { hosts: 'Mr & Mrs Godwin', area: 'Phase 4', blurb: 'A vibrant house church in Phase 4 for Bible study and fellowship.' },
  { hosts: 'Dave & Monica Fischer', area: 'Phakalane', blurb: 'Rich fellowship and Bible teaching in Phakalane.' },
  { hosts: 'Tebogo Filipo', area: 'Gaborone Phase 4', blurb: 'Midweek fellowship and Bible study in Phase 4.' },
  { hosts: 'Laone & Bettina Tau', area: 'Tlokweng', blurb: 'Community and spiritual growth in Tlokweng.' },
  { hosts: 'Maureen Kalane', area: 'UB', blurb: 'A vibrant house church near the University of Botswana.' },
];

export type ChurchEvent = {
  slug: string; title: string; category: string; date: string; // ISO date
  time: string; venue: string; summary: string; fee?: string; contact?: string; image?: string; registerUrl?: string;
};
// Add new events at the top. Past events move to "Past events" automatically.
export const EVENTS: ChurchEvent[] = [
  { slug: 'perspectives-on-the-apostolic-2026', title: 'Perspectives on the Apostolic with Thamo Naidoo', category: 'Conference',
    date: '2026-10-24', time: '08:30 – 13:10', venue: 'Gate Gaborone, Plot 54014, Gaborone West',
    summary: 'Teaching with Thamo Naidoo, Presiding Apostolic Elder of Gate Global Family, equipping believers with apostolic principles and understanding. Refreshments provided; freewill offerings received.',
    contact: 'otenggate@gmail.com · +267 7550 7981', image: '/img/poa-thamo-naidoo.jpg' },
  { slug: 'couples-picnic-2026', title: 'Couples Picnic', category: 'Fellowship', date: '2026-09-19',
    time: '09:30 arrival · 10:00 start', venue: 'Ditlhareng Estate, Gabane (Taylor’s Place)',
    summary: 'A morning for couples. Bring a pen, notebook, a picnic basket for two and a blanket or chairs. Tea, coffee and water provided.',
    fee: 'P60 per couple', contact: 'WhatsApp +267 7217 1066', image: '/img/couples-picnic-2026.jpg' },
];

export const NAV = [
  { href: '/about', label: 'About' },
  { href: '/sermons', label: 'Sermons' },
  { href: '/events', label: 'Events' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/house-church', label: 'House Church' },
  { href: '/contact', label: 'Contact' },
];

// Giving details. Fill in with the church's official bank / mobile money details.
// While empty, the Give page asks visitors to contact the church office.
export const GIVING: { label: string; lines: string[] }[] = [];
