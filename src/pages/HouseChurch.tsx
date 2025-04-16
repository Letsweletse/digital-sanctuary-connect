
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { findMany, HouseChurchGroup } from '@/lib/mongodb';
import { Loader2, MapPin, Calendar, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
          // Set default house church groups based on provided information
          setGroups(defaultHouseChurches);
        }
      } catch (err) {
        console.error('Error fetching house church groups', err);
        setError('Could not connect to database. Showing default groups.');
        // Set default house church groups in case of error
        setGroups(defaultHouseChurches);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGroups();
  }, []);
  
  // Default house church data based on the provided information
  const defaultHouseChurches: HouseChurchGroup[] = [
    {
      id: "1",
      name: "Oteng & Carryadah Leepile House Church",
      day: "Wednesday",
      time: "18:30",
      location: "Block 5",
      description: "Join us for fellowship, prayer, and Bible study in our welcoming home in Block 5.",
      leaders: "Oteng & Carryadah Leepile",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80"
    },
    {
      id: "2",
      name: "Peter & Naomi Taylor House Church",
      day: "Wednesday",
      time: "18:30",
      location: "Gabane",
      description: "Experience community and spiritual growth in our house church in Gabane.",
      leaders: "Peter & Naomi Taylor",
      image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
    },
    {
      id: "3",
      name: "Godwin & Lemolemo House Church",
      day: "Wednesday",
      time: "18:30",
      location: "Phase 4",
      description: "Join our vibrant house church community in Phase 4 for Bible study and fellowship.",
      leaders: "Godwin & Lemolemo",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
    },
    {
      id: "4",
      name: "Dave & Monica Fischer House Church",
      day: "Wednesday",
      time: "18:30",
      location: "Phakalane",
      description: "Experience rich fellowship and Bible teaching in our house church in Phakalane.",
      leaders: "Dave & Monica Fischer",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
    },
    {
      id: "5",
      name: "Tebogo Filipo House Church",
      day: "Wednesday",
      time: "18:30",
      location: "Gaborone Phase 4",
      description: "Join us for midweek fellowship and Bible study in Phase 4.",
      leaders: "Tebogo Filipo",
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80"
    },
    {
      id: "6",
      name: "Laone & Bettina Tau House Church",
      day: "Wednesday", 
      time: "18:30",
      location: "Tlokweng",
      description: "Experience community and spiritual growth with our house church in Tlokweng.",
      leaders: "Laone & Bettina Tau",
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80"
    },
    {
      id: "7",
      name: "Maureen Kalane House Church",
      day: "Wednesday",
      time: "18:30",
      location: "UB",
      description: "Join our vibrant house church near UB for fellowship and Bible study.",
      leaders: "Maureen Kalane",
      image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
    }
  ];
  
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
                Browse our current House Church groups and find one that fits your location. 
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
                  <Card key={group.id} className="overflow-hidden flex flex-col h-full shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative pb-[60%]">
                      <img 
                        src={group.image} 
                        alt={group.name}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                        <h3 className="text-xl font-bold text-white mb-1">{group.name}</h3>
                      </div>
                    </div>
                    
                    <CardContent className="p-6 flex-grow flex flex-col">
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center text-church-neutral-700">
                          <Users className="h-4 w-4 mr-2 text-church-blue" />
                          <span>{group.leaders}</span>
                        </div>
                        <div className="flex items-center text-church-neutral-700">
                          <MapPin className="h-4 w-4 mr-2 text-church-blue" />
                          <span>{group.location}</span>
                        </div>
                        <div className="flex items-center text-church-neutral-700">
                          <Calendar className="h-4 w-4 mr-2 text-church-blue" />
                          <span>{group.day}s</span>
                        </div>
                        <div className="flex items-center text-church-neutral-700">
                          <Clock className="h-4 w-4 mr-2 text-church-blue" />
                          <span>{group.time}</span>
                        </div>
                      </div>
                      
                      <p className="text-church-neutral-700 flex-grow">{group.description}</p>
                      
                      <div className="mt-6">
                        <Link to="/contact" className="btn-primary w-full block text-center">
                          Contact for Information
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
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

