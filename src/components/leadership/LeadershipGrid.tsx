import React from 'react';
import ProfileCard from './ProfileCard';
import PastorCard from './PastorCard';
import { LeadershipPerson } from '@/types/leadershipTypes';
import useMongoData from '@/hooks/useMongoData';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface LeadershipGridProps {
  leaders?: LeadershipPerson[];
}

const LeadershipGrid: React.FC<LeadershipGridProps> = ({ leaders = [] }) => {
  const { data: fetchedLeaders, isLoading } = useMongoData<LeadershipPerson>('leaders', {});
  
  const leadersList = leaders.length > 0 ? leaders : fetchedLeaders || [];
  
  const pastorImage = "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/Senior%20Pastor_1743598781352.jpeg";
  
  const pastorBio = `
    <p>Pastor Kobus Bezuidenhout, our Senior Pastor, has been fathering our community for over 15+ years with wisdom and grace.</p>
    
  `;

  // Pastor's recent sermons
  const recentSermons = [
    {
      title: "The Prophetic Office in Context of the Apostolic Season - Session 2",
      url: "https://www.youtube.com/watch?v=dMf8NevhDv8"
    },
    {
      title: "The Prophetic Office In Context Of The Apostolic Seasons",
      url: "https://www.youtube.com/watch?v=syZyhjJffmU"
    }
  ];

  const elders = [
    {
      id: "elder1",
      name: "Peter & Naomi Taylor",
      role: "Church Elders",
      image: "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/155382918_883087192544125_2679451527633776926_n_1743917368955.jpeg",
      bio: "Peter and Naomi with grace and dedication, bringing years of pastoral care experience to our congregation."
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
      name: "Dave & Monica Fisher",
      role: "Church Elders",
      image: "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/Dave%20and%20Monica_1744794085154.jpeg",
      bio: "Dave and Monica Fisher serve with compassion and wisdom, bringing deep spiritual insight to our congregation."
    }
  ];

  const pastors = [
    {
      id: "pastor1",
      name: "Pastor Oteng & Carry Leepile",
      role: "Pastors",
      image: "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/Pastor%20Oteng%20and%20Carry%20Leepile_1744372778422.jpeg",
      bio: "Pastor Oteng and Carry Leepile serve our congregation with passion and dedication, bringing spiritual guidance and leadership."
    },
    {
      id: "pastor2",
      name: "Pastor Cynthia Harman",
      role: "Pastors",
      image: "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/Pastor%20Cynthia%20Harman_1744372568644.jpeg",
      bio: "Pastor Cynthia Harman brings a dynamic and inspiring approach to ministry, serving our congregation with grace and wisdom."
    }
  ];

  if (isLoading) {
    return <div className="text-center py-12">Loading leadership team...</div>;
  }

  return (
    <div className="bg-white text-gray-800 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="text-sm uppercase tracking-widest text-gray-500 font-medium">Our Leadership Team</span>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#24324b] relative inline-block">
            Serving With Purpose
          </h1>
          <div className="h-1 w-20 bg-[#24324b] mx-auto mb-6"></div>
          <p className="text-lg max-w-3xl mx-auto text-gray-600">
            Meet the dedicated leaders who guide our church with wisdom, compassion and vision.
          </p>
        </div>
        
        {/* Senior Pastor Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#24324b] inline-block relative">
              Senior Pastor
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#24324b]"></div>
            </h2>
          </div>
          <div className="shadow-md rounded-lg overflow-hidden">
            <PastorCard 
              name="Pastor Kobus Bezuidenhout" 
              role="Senior Pastor" 
              image={pastorImage}
              bio={pastorBio}
              sermons={recentSermons}
            />
          </div>
        </div>
        
        {/* Pastors Section */}
        {pastors.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#24324b] inline-block relative">
                Pastors
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#24324b]"></div>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastors.map((pastor) => (
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
        )}

        {/* Elders Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#24324b] inline-block relative">
              Church Elders
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#24324b]"></div>
            </h2>
          </div>
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
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#24324b] inline-block relative">
                Leadership Team
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#24324b]"></div>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leadersList.map((leader) => {
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
    </div>
  );
};

export default LeadershipGrid;
