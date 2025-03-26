import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { findMany } from '@/lib/mongodb';
import { Loader2 } from 'lucide-react';
import SermonAudio from '@/components/media/SermonAudio';

interface HouseChurchGroup {
  id: string;
  name: string;
  day: string;
  time: string;
  location: string;
  description: string;
  leaders: string;
  image: string;
}

const HouseChurch = () => {
  const [groups, setGroups] = useState<HouseChurchGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const mongoGroups = await findMany('house_church_groups', {});
        
        if (mongoGroups && mongoGroups.length > 0) {
          setGroups(mongoGroups as HouseChurchGroup[]);
        } else {
          setGroups([
            {
              id: '1',
              name: 'Faith & Family',
              day: 'Monday',
              time: '7:00 PM',
              location: 'North Side',
              description: 'A group focused on strengthening families through Bible study and prayer, with activities for children and teens.',
              leaders: 'James & Mary Wilson',
              image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80'
            },
            {
              id: '2',
              name: 'Young Adults',
              day: 'Tuesday',
              time: '7:30 PM',
              location: 'Downtown',
              description: 'For college students and young professionals seeking community and spiritual growth in a relaxed atmosphere.',
              leaders: 'Michael & Sarah Thompson',
              image: 'https://images.unsplash.com/photo-1529333166437-7feb29c65e8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80'
            },
            {
              id: '3',
              name: 'Deeper Walk',
              day: 'Wednesday',
              time: '6:30 PM',
              location: 'East Side',
              description: 'An in-depth Bible study group focused on theological understanding and practical application.',
              leaders: 'Pastor Robert Chen',
              image: 'https://images.unsplash.com/photo-1577896851698-52dd2060e3b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
            },
            {
              id: '4',
              name: 'Senior Fellowship',
              day: 'Thursday',
              time: '10:00 AM',
              location: 'Church Campus',
              description: 'A daytime group for seniors focusing on fellowship, prayer, and mutual support.',
              leaders: 'Harold & Betty Johnson',
              image: 'https://images.unsplash.com/photo-1573497491765-55a968388b83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
            },
            {
              id: '5',
              name: 'Women of Grace',
              day: 'Friday',
              time: '9:30 AM',
              location: 'West Side',
              description: 'A women\'s Bible study group with childcare provided, focusing on growing in faith amid life\'s many seasons.',
              leaders: 'Jennifer Adams',
              image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
            },
            {
              id: '6',
              name: 'International Fellowship',
              day: 'Saturday',
              time: '5:00 PM',
              location: 'South Side',
              description: 'A multicultural group celebrating diverse backgrounds while studying God\'s Word together. Several languages spoken.',
              leaders: 'Gabriel & Sophia Rodriguez',
              image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
            }
          ]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching house church groups', err);
        setGroups([
          {
            id: '1',
            name: 'Faith & Family',
            day: 'Monday',
            time: '7:00 PM',
            location: 'North Side',
            description: 'A group focused on strengthening families through Bible study and prayer, with activities for children and teens.',
            leaders: 'James & Mary Wilson',
            image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80'
          },
          {
            id: '2',
            name: 'Young Adults',
            day: 'Tuesday',
            time: '7:30 PM',
            location: 'Downtown',
            description: 'For college students and young professionals seeking community and spiritual growth in a relaxed atmosphere.',
            leaders: 'Michael & Sarah Thompson',
            image: 'https://images.unsplash.com/photo-1529333166437-7feb29c65e8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80'
          },
          {
            id: '3',
            name: 'Deeper Walk',
            day: 'Wednesday',
            time: '6:30 PM',
            location: 'East Side',
            description: 'An in-depth Bible study group focused on theological understanding and practical application.',
            leaders: 'Pastor Robert Chen',
            image: 'https://images.unsplash.com/photo-1577896851698-52dd2060e3b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
          },
          {
            id: '4',
            name: 'Senior Fellowship',
            day: 'Thursday',
            time: '10:00 AM',
            location: 'Church Campus',
            description: 'A daytime group for seniors focusing on fellowship, prayer, and mutual support.',
            leaders: 'Harold & Betty Johnson',
            image: 'https://images.unsplash.com/photo-1573497491765-55a968388b83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
          },
          {
            id: '5',
            name: 'Women of Grace',
            day: 'Friday',
            time: '9:30 AM',
            location: 'West Side',
            description: 'A women\'s Bible study group with childcare provided, focusing on growing in faith amid life\'s many seasons.',
            leaders: 'Jennifer Adams',
            image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
          },
          {
            id: '6',
            name: 'International Fellowship',
            day: 'Saturday',
            time: '5:00 PM',
            location: 'South Side',
            description: 'A multicultural group celebrating diverse backgrounds while studying God\'s Word together. Several languages spoken.',
            leaders: 'Gabriel & Sophia Rodriguez',
            image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
          }
        ]);
        setError('Could not connect to database. Showing default groups.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGroups();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 page-transition">
        <section className="bg-church-blue py-16 md:py-24 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium text-church-blue mb-4">
                Small Groups
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                House Church Ministry
              </h1>
              <p className="text-lg text-white/90">
                Experience the warmth of Christian community through our house church groups, 
                where faith is nurtured through fellowship, prayer, and Bible study in a home setting.
              </p>
            </div>
          </div>
        </section>
        
        <section id="find-group" className="py-16 bg-church-neutral-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-church-gold-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
                Join a Group
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
                Find Your House Church
              </h2>
              <p className="max-w-2xl mx-auto text-church-neutral-700">
                Browse our current House Church groups and find one that fits your schedule and interests. 
                New members are always welcome!
              </p>
              {error && (
                <div className="mt-4 p-3 bg-amber-50 text-amber-700 rounded-lg mx-auto max-w-2xl">
                  {error}
                </div>
              )}
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-60">
                <Loader2 className="h-10 w-10 text-church-blue animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groups.map((group) => (
                  <div key={group.id} className="glass-panel overflow-hidden flex flex-col h-full">
                    <div className="relative pb-[60%]">
                      <img 
                        src={group.image} 
                        alt={group.name}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                        <div className="inline-block bg-church-gold px-2 py-1 rounded text-xs font-medium text-church-neutral-900 mb-2">
                          {group.day}s at {group.time}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{group.name}</h3>
                        <p className="text-white/90 text-sm">{group.location} • Led by {group.leaders}</p>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col">
                      <p className="text-church-neutral-700 flex-grow">{group.description}</p>
                      <div className="mt-6">
                        <button className="btn-primary w-full">Request to Join</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-church-blue-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
                Listen to Our Messages
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
                House Church Teachings
              </h2>
              <p className="max-w-2xl mx-auto text-church-neutral-700">
                Access our house church teachings and discussions through SermonAudio.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto glass-panel p-6">
              <SermonAudio churchId="gategaborone" showLatest={true} count={3} useMongoConfig={true} />
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-church-neutral-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-church-blue-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
                Watch Our Videos
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
                Recent Messages
              </h2>
              <p className="max-w-2xl mx-auto text-church-neutral-700">
                Watch our latest sermons and teachings from our YouTube channel.
              </p>
            </div>
            
            <div className="relative pb-9 h-0" style={{ paddingBottom: "56.25%" }}>
              <iframe 
                src="https://www.youtube.com/embed?listType=user_uploads&list=gategaboronebotswana2702" 
                className="absolute top-0 left-0 w-full h-full"
                title="Gate Gaborone Ministries YouTube Channel"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="mt-8 text-center">
              <a 
                href="https://www.youtube.com/@gategaboronebotswana2702" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Visit Our YouTube Channel
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HouseChurch;
