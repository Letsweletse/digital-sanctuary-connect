import React from 'react';
import ProfileCard from './ProfileCard';
import PastorCard from './PastorCard';
import { LeadershipPerson } from '@/types/leadershipTypes';
import useMongoData from '@/hooks/useMongoData';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
      image: "https://images.unsplash.com/photo-1573497491765-55a968388b83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      bio: "Dave and Monica Fisher serve with compassion and wisdom, bringing deep spiritual insight to our congregation."
    }
  ];

  const pastors = [
    {
      id: "pastor1",
      name: "Pastor Oteng & Carry Leepile",
      role: "Pastors",
      image: "https://images.unsplash.com/photo-1573497491765-55a968388b83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      bio: "Pastor Oteng and Carry Leepile serve our congregation with passion and dedication, bringing spiritual guidance and leadership."
    },
    {
      id: "pastor2",
      name: "Pastor Cynthia Harman",
      role: "Pastors",
      image: "https://images.unsplash.com/photo-1573497491765-55a968388b83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      bio: "Pastor Cynthia Harman brings a dynamic and inspiring approach to ministry, serving our congregation with grace and wisdom."
    }
  ];

  if (isLoading) {
    return <div className="text-center py-12">Loading leadership team...</div>;
  }

  return (
    <div className="bg-[#24324b] text-white min-h-screen pt-8 pb-20">
      <div className="container mx-auto px-4 py-12">
        {/* Premium Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white relative inline-block">
            <span className="relative z-10">Our Leadership</span>
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#e6c98f] to-[#f0d9a5] z-0"></span>
          </h1>
          <p className="text-lg max-w-3xl mx-auto text-gray-300 font-light">
            Meet the dedicated leaders who guide our church with wisdom, compassion and vision.
          </p>
        </div>
        
        {/* Senior Pastor Section */}
        <div className="mb-20">
          <div className="flex items-center justify-center mb-10">
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent to-[#e6c98f]"></div>
            <h2 className="text-3xl font-bold text-center px-6">Senior Pastor</h2>
            <div className="h-0.5 w-24 bg-gradient-to-r from-[#e6c98f] to-transparent"></div>
          </div>
          <div className="bg-[#2a3b57] rounded-xl p-2 shadow-xl transform transition-all duration-300 hover:shadow-2xl">
            <PastorCard 
              name="Pastor Kobus Bezuidenhout" 
              role="Senior Pastor" 
              image={pastorImage}
              bio={pastorBio}
            />
          </div>
        </div>
        
        {/* Pastors Section */}
        {pastors.length > 0 && (
          <div className="mt-20 mb-20">
            <div className="flex items-center justify-center mb-10">
              <div className="h-0.5 w-24 bg-gradient-to-r from-transparent to-[#e6c98f]"></div>
              <h2 className="text-3xl font-bold text-center px-6">Pastors</h2>
              <div className="h-0.5 w-24 bg-gradient-to-r from-[#e6c98f] to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastors.map((pastor) => (
                <div key={pastor.id} className="transform transition-all duration-300 hover:-translate-y-2">
                  <div className="bg-[#2a3b57] rounded-xl overflow-hidden border border-[#3a4b67] shadow-lg">
                    <ProfileCard 
                      key={pastor.id}
                      name={pastor.name}
                      role={pastor.role}
                      image={pastor.image}
                      bio={pastor.bio}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Elders Section */}
        <div className="mt-20">
          <div className="flex items-center justify-center mb-10">
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent to-[#e6c98f]"></div>
            <h2 className="text-3xl font-bold text-center px-6">Church Elders</h2>
            <div className="h-0.5 w-24 bg-gradient-to-r from-[#e6c98f] to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {elders.map(elder => (
              <div key={elder.id} className="transform transition-all duration-300 hover:-translate-y-2">
                <div className="bg-[#2a3b57] rounded-xl overflow-hidden border border-[#3a4b67] shadow-lg">
                  <ProfileCard 
                    key={elder.id}
                    name={elder.name}
                    role={elder.role}
                    image={elder.image}
                    bio={elder.bio}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Other Leadership Team Members */}
        {leadersList.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-center mb-10">
              <div className="h-0.5 w-24 bg-gradient-to-r from-transparent to-[#e6c98f]"></div>
              <h2 className="text-3xl font-bold text-center px-6">Leadership Team</h2>
              <div className="h-0.5 w-24 bg-gradient-to-r from-[#e6c98f] to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leadersList.map((leader) => {
                if (leader.role === "Senior Pastor" || leader.role.includes("Elder")) {
                  return null;
                }
                return (
                  <div key={leader.id} className="transform transition-all duration-300 hover:-translate-y-2">
                    <div className="bg-[#2a3b57] rounded-xl overflow-hidden border border-[#3a4b67] shadow-lg">
                      <ProfileCard 
                        key={leader.id}
                        name={leader.name}
                        role={leader.role}
                        image={leader.image}
                        bio={leader.bio}
                        email={leader.email}
                        phone={leader.phone}
                      />
                    </div>
                  </div>
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
