
import React from 'react';
import ProfileCard from './ProfileCard';
import { LeadershipPerson } from '@/types/leadershipTypes';
import useMongoData from '@/hooks/useMongoData';

interface LeadershipGridProps {
  leaders?: LeadershipPerson[];
}

const LeadershipGrid: React.FC<LeadershipGridProps> = ({ leaders = [] }) => {
  // Use the MongoDB hook to fetch leaders if not provided via props
  const { data: fetchedLeaders, isLoading } = useMongoData<LeadershipPerson>('leaders', {});
  
  // Use provided leaders or fetched leaders
  const leadersList = leaders.length > 0 ? leaders : fetchedLeaders || [];
  
  // Custom card for senior pastor with updated image URL
  const pastorImage = "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/Senior%20Pastor_1743597241096.jpeg";
  
  const pastorBio = `
    <p>Rev. Dr. Otengate, our Senior Pastor, has been shepherding our community for over 15 years with wisdom and compassion.</p>
    <p>With a doctorate in Theology from Stellenbosch University and years of mission work across Southern Africa, he brings rich insights to scripture and practical application to daily Christian living.</p>
    <p>He and his wife, Mrs. Otengate, have three children and have dedicated their lives to building our church community.</p>
  `;

  if (isLoading) {
    return <div className="text-center py-12">Loading leadership team...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <ProfileCard 
          name="Rev. Dr. Otengate" 
          role="Senior Pastor" 
          image={pastorImage}
          bio={pastorBio}
          email="otenggate@gmail.com"
          phone="+267 71 123 456"
          featured={true}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {leadersList.map((leader) => (
          <ProfileCard 
            key={leader.id}
            name={leader.name}
            role={leader.role}
            image={leader.image}
            bio={leader.bio}
            email={leader.email}
            phone={leader.phone}
            featured={false}
          />
        ))}
      </div>
    </div>
  );
};

export default LeadershipGrid;
