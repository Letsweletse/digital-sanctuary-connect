
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
    <p>Pastor Kobus Bezuidenhout, our Senior Pastor, has been shepherding our community for over 15 years with wisdom and compassion.</p>
    <p>With a doctorate in Theology from Stellenbosch University and years of mission work across Southern Africa, he brings rich insights to scripture and practical application to daily Christian living.</p>
    <p>He and his wife have three children and have dedicated their lives to building our church community.</p>
  `;

  // Pastor's recent sermons
  const pastorSermons = [
    { title: "The Power of Faith", url: "https://www.youtube.com/watch?v=example1" },
    { title: "Walking in God's Purpose", url: "https://www.youtube.com/watch?v=example2" },
    { title: "Kingdom Principles for Today", url: "https://www.youtube.com/watch?v=example3" }
  ];

  // Elder data - Updated with the new elders information
  const elders = [
    {
      id: "elder1",
      name: "Peter & Naomi Taylor",
      role: "Church Elders",
      image: "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/Peter%20and%20Naomi%20Taylor_1743684661549.jpeg",
      bio: "Peter and Naomi have served our church for over a decade, providing wise counsel and spiritual leadership to our congregation."
    },
    {
      id: "elder2",
      name: "Oteng & Carry Leepile",
      role: "Church Elders",
      image: "https://images.unsplash.com/photo-1573497491765-55a968388b83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      bio: "Oteng and Carry lead with grace and dedication, bringing years of pastoral care experience to our congregation."
    },
    {
      id: "elder3",
      name: "Thabiso & Lesogo Thwane",
      role: "Church Elders",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      bio: "Thabiso and Lesogo oversee our outreach programs and have been instrumental in building community partnerships throughout Gaborone."
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
      
      {/* Elders Section */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Church Elders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {elders.map(elder => (
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
              if (leader.role === "Senior Pastor" || leader.role.includes("Elder")) {
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
