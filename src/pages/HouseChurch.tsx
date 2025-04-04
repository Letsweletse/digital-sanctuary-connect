
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { findMany, HouseChurchGroup } from '@/lib/mongodb';
import { Loader2 } from 'lucide-react';

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
          // Convert the _id to id for consistency
          const typedGroups = mongoGroups.map((doc: any) => {
            const { _id, ...data } = doc;
            return {
              id: _id.toString(),
              ...data
            } as HouseChurchGroup;
          });
          
          setGroups(typedGroups);
        } else {
          console.warn('No house church groups found in database, using defaults');
          setError('Could not load groups from database. Showing default groups.');
        }
      } catch (err) {
        console.error('Error fetching house church groups', err);
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
      </main>
      
      <Footer />
    </div>
  );
};

export default HouseChurch;
