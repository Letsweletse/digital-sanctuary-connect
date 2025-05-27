
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConferenceOverview from './ConferenceOverview';
import ConferenceSchedule from './ConferenceSchedule';
import ConferenceSpeakers from './ConferenceSpeakers';

interface Session {
  id: string;
  day: string;
  time: string;
  title: string;
  description: string;
  speakers: string[];
  location: string;
}

interface Speaker {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface ConferenceTabsProps {
  sessions: Session[];
  speakers: Speaker[];
}

const ConferenceTabs: React.FC<ConferenceTabsProps> = ({ sessions, speakers }) => {
  return (
    <div className="container mx-auto px-4 py-8 pb-16">
      <Tabs defaultValue="overview" className="max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="speakers">Speakers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <ConferenceOverview />
        </TabsContent>
        
        <TabsContent value="schedule">
          <ConferenceSchedule sessions={sessions} />
        </TabsContent>
        
        <TabsContent value="speakers">
          <ConferenceSpeakers speakers={speakers} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConferenceTabs;
