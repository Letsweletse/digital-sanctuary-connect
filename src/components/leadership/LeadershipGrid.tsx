
import React from 'react';
import ProfileCard from './ProfileCard';
import PastorCard from './PastorCard';
import { LeadershipPerson } from '@/types/leadershipTypes';
import useMongoData from '@/hooks/useMongoData';
import { Card, CardContent } from '@/components/ui/card';

interface LeadershipGridProps {
  leaders?: LeadershipPerson[];
}

const LeadershipGrid: React.FC<LeadershipGridProps> = ({ leaders = [] }) => {
  // Use the MongoDB hook to fetch leaders if not provided via props
  const { data: fetchedLeaders, isLoading } = useMongoData<LeadershipPerson>('leaders', {});
  
  // Use provided leaders or fetched leaders
  const leadersList = leaders.length > 0 ? leaders : fetchedLeaders || [];
  
  // Senior Pastor data
  const pastorImage = "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/Senior%20Pastor_1743598781352.jpeg";
  
  const pastorBio = `
    <p>Pastor Kobus Bezuidenhout, our Senior Pastor, has been fathering our community for over 15+ years with wisdom and grace.</p>
    
  `;

  // Pastor's recent sermons
  const pastorSermons = [
    { title: "The Prophetic Office In Context Of The Apostolic Seasons", url: "https://www.youtube.com/watch?v=syZyhjJffmU" },
    { title: "2nd March Sunday Sermon 2025", url: "https://www.youtube.com/watch?v=T96Pf2ngosg&t=6657s" },
    { title: "23rd February Sunday Sermon 2025", url: "https://www.youtube.com/watch?v=HxDFrJCwL4Y" }
  ];

  // Elder data - Updated with the new images
  const elders = [
    {
      id: "elder1",
      name: "Peter & Naomi Taylor",
      role: "Church Elders",
      image: "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/155382918_883087192544125_2679451527633776926_n_1743917368955.jpeg",
      bio: "Peter and Naomi with grace and dedication, bringing years of pastoral care experience to our congregation."
    },
    {
      id: "elder2",
      name: "Pastor Oteng & Carry Leepile",
      role: "Pastors",
      image: "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/Pastor%20Oteng%20and%20Carry%20Leepile_1744372778422.jpeg",
      bio: "Pastor Oteng and Carry lead with grace and dedication, bringing years of pastoral care experience to our congregation."
    },
    {
      id: "elder3",
      name: "Thabiso & Lesogo Thwane",
      role: "Church Elders",
      image: "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/Thabiso%20&%20Lesogo%20Thwane_1743684836732.jpeg",
      bio: "Thabiso and Lesogo with grace and dedication, bringing years of pastoral care experience to our congregation."
    },
    {
      id: "elder4",
      name: "Pastor Cynthia Harman",
      role: "Pastor",
      image: "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/Pastor%20Cynthia%20Harman_1744372568644.jpeg",
      bio: "Pastor Cynthia Harman serves with compassion and wisdom, bringing valuable spiritual guidance to our congregation."
    },
    {
      id: "elder5",
      name: "Dave & Monica Fischer",
      role: "Church Elders",
      image: "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/Dave%20and%20Monica_1744372976662.jpeg",
      bio: "Dave and Monica serve the congregation with dedication and compassion, bringing valuable insights and pastoral care to our church family."
    }
  ];

  if (isLoading) {
    return <div className="text-center py-12">Loading leadership team...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Senior Pastor Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Senior Pastor</h2>
        <PastorCard 
          name="Pastor Kobus Bezuidenhout" 
          role="Senior Pastor" 
          image={pastorImage}
          bio={pastorBio}
          sermons={pastorSermons}
        />
      </div>
      
      {/* Pastors Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Pastors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {elders.filter(elder => elder.role === "Pastors" || elder.role === "Pastor").map(pastor => (
            <ProfileCard 
              key={pastor.id}
              name={pastor.name}
              role={pastor.role}
              image={pastor.image}
              bio={pastor.bio}
            />
          ))}
        </div>
      </div>
      
      {/* Elders Section */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Church Elders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {elders.filter(elder => elder.role === "Church Elders").map(elder => (
            <ProfileCard 
              key={elder.id}
              name={elder.name}
              role={elder.role}
              image={elder.image}
              bio={elder.bio}
            />
          ))}
        </div>
      </div>
      
      {/* Other Leadership Team Members */}
      {leadersList.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadersList.map((leader) => {
              // Skip if this leader is already listed as senior pastor or elder
              if (leader.role === "Senior Pastor" || leader.role.includes("Elder") || leader.role === "Pastor" || leader.role === "Pastors") {
                return null;
              }
              return (
                <ProfileCard 
                  key={leader.id}
                  name={leader.name}
                  role={leader.role}
                  image={leader.image}
                  bio={leader.bio}
                  email={leader.email}
                  phone={leader.phone}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadershipGrid;
