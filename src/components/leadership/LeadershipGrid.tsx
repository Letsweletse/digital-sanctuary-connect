
import React from 'react';
import ProfileCard from './ProfileCard';
import PastorCard from './PastorCard';
import { LeadershipPerson } from '@/types/leadershipTypes';
import useMongoData from '@/hooks/useMongoData';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Award, Star } from 'lucide-react';

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
    <div className="bg-gradient-to-b from-white to-church-neutral-50 text-[#24324b] min-h-screen pt-8 pb-20">
      <div className="container mx-auto px-4 py-12">
        {/* Premium Header */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center mb-3">
            <Star className="text-[#e6c98f] h-5 w-5 mr-1" />
            <span className="text-sm uppercase tracking-widest text-church-neutral-600 font-medium">Our Leadership Team</span>
            <Star className="text-[#e6c98f] h-5 w-5 ml-1" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#24324b] relative inline-block">
            <span className="relative z-10">Divine Leadership</span>
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#e6c98f] via-[#f0d9a5] to-[#e6c98f] z-0"></span>
          </h1>
          <p className="text-lg max-w-3xl mx-auto text-gray-600 font-light">
            Meet the dedicated leaders who guide our church with wisdom, compassion and vision.
          </p>
        </div>
        
        {/* Senior Pastor Section */}
        <div className="mb-20">
          <div className="flex items-center justify-center mb-10">
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent to-[#e6c98f]"></div>
            <div className="flex items-center px-6">
              <Award className="h-6 w-6 text-[#e6c98f] mr-2" />
              <h2 className="text-3xl font-bold text-center text-[#24324b]">Senior Pastor</h2>
            </div>
            <div className="h-0.5 w-24 bg-gradient-to-r from-[#e6c98f] to-transparent"></div>
          </div>
          <div className="bg-white rounded-xl p-2 shadow-xl transform transition-all duration-300 hover:shadow-2xl border border-[#e6c98f]/20">
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
          <div className="mt-20 mb-20">
            <div className="flex items-center justify-center mb-10">
              <div className="h-0.5 w-24 bg-gradient-to-r from-transparent to-[#e6c98f]"></div>
              <div className="flex items-center px-6">
                <Award className="h-5 w-5 text-[#e6c98f] mr-2" />
                <h2 className="text-3xl font-bold text-center text-[#24324b]">Pastors</h2>
              </div>
              <div className="h-0.5 w-24 bg-gradient-to-r from-[#e6c98f] to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastors.map((pastor) => (
                <div key={pastor.id} className="transform transition-all duration-300 hover:-translate-y-2">
                  <div className="bg-white rounded-xl overflow-hidden border border-[#e6c98f]/20 shadow-lg hover:shadow-xl">
                    <ProfileCard 
                      key={pastor.id}
                      name={pastor.name}
                      role={pastor.role}
                      image={pastor.image}
                      bio={pastor.bio}
                      featured={true}
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
            <div className="flex items-center px-6">
              <Award className="h-5 w-5 text-[#e6c98f] mr-2" />
              <h2 className="text-3xl font-bold text-center text-[#24324b]">Church Elders</h2>
            </div>
            <div className="h-0.5 w-24 bg-gradient-to-r from-[#e6c98f] to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {elders.map(elder => (
              <div key={elder.id} className="transform transition-all duration-300 hover:-translate-y-2">
                <div className="bg-white rounded-xl overflow-hidden border border-[#e6c98f]/20 shadow-lg hover:shadow-xl">
                  <ProfileCard 
                    key={elder.id}
                    name={elder.name}
                    role={elder.role}
                    image={elder.image}
                    bio={elder.bio}
                    featured={true}
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
              <div className="flex items-center px-6">
                <Award className="h-5 w-5 text-[#e6c98f] mr-2" />
                <h2 className="text-3xl font-bold text-center text-[#24324b]">Leadership Team</h2>
              </div>
              <div className="h-0.5 w-24 bg-gradient-to-r from-[#e6c98f] to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leadersList.map((leader) => {
                if (leader.role === "Senior Pastor" || leader.role.includes("Elder")) {
                  return null;
                }
                return (
                  <div key={leader.id} className="transform transition-all duration-300 hover:-translate-y-2">
                    <div className="bg-white rounded-xl overflow-hidden border border-[#e6c98f]/20 shadow-lg hover:shadow-xl">
                      <ProfileCard 
                        key={leader.id}
                        name={leader.name}
                        role={leader.role}
                        image={leader.image}
                        bio={leader.bio}
                        email={leader.email}
                        phone={leader.phone}
                        featured={true}
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
