
import React from 'react';
import ProfileCard from './ProfileCard';
import useMongoData from '@/hooks/useMongoData';
import { Skeleton } from '@/components/ui/skeleton';

interface LeadershipPerson {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  email?: string;
  isSeniorPastor?: boolean;
}

const LeadershipGrid: React.FC = () => {
  const { data: leaders, isLoading } = useMongoData<LeadershipPerson>('leadership');
  
  // Mock data for development/fallback
  const mockLeaders: LeadershipPerson[] = [
    {
      id: '1',
      name: 'Pastor John Williams',
      role: 'Senior Pastor',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      bio: 'Pastor John has been leading our congregation for over 15 years. With a background in theology and a passion for community service, he has helped our church grow spiritually and in numbers. His powerful messages inspire us to live out our faith in practical ways.',
      email: 'pastor.john@gategaborone.org',
      isSeniorPastor: true
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'Worship Director',
      image: 'https://images.unsplash.com/photo-1573497491765-55a968388b83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      bio: 'Sarah has been leading our worship team for 8 years. Her beautiful voice and heart for worship create an atmosphere where people can truly connect with God. She also mentors young musicians in our church community.',
      email: 'sarah.j@gategaborone.org'
    },
    {
      id: '3',
      name: 'Michael Thompson',
      role: 'Youth Pastor',
      image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
      bio: 'Michael has a heart for guiding the next generation. His energetic approach to youth ministry combines fun activities with deep spiritual lessons. Under his leadership, our youth program has grown from 15 to over 50 active participants.',
      email: 'michael.t@gategaborone.org'
    },
    {
      id: '4',
      name: 'Dr. Elizabeth Chen',
      role: 'Elder',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      bio: 'Dr. Chen brings wisdom and insight to our leadership team. As a practicing physician and devoted Christian, she helps us navigate both practical and spiritual challenges. She leads our health ministry and international missions efforts.',
      email: 'elizabeth.c@gategaborone.org'
    }
  ];

  // Use mock data if no real data is loaded
  const displayLeaders = leaders.length > 0 ? leaders : mockLeaders;
  
  // Find the senior pastor for special treatment
  const seniorPastor = displayLeaders.find(leader => leader.isSeniorPastor);
  const otherLeaders = displayLeaders.filter(leader => !leader.isSeniorPastor);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-panel p-6">
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {seniorPastor && (
        <ProfileCard 
          name={seniorPastor.name}
          role={seniorPastor.role}
          image={seniorPastor.image}
          bio={seniorPastor.bio}
          email={seniorPastor.email}
          isSeniorPastor={true}
        />
      )}
      
      {otherLeaders.map(leader => (
        <ProfileCard
          key={leader.id}
          name={leader.name}
          role={leader.role}
          image={leader.image}
          bio={leader.bio}
          email={leader.email}
        />
      ))}
    </div>
  );
};

export default LeadershipGrid;
