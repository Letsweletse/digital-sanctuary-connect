
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { findMany, HouseChurchGroup } from '@/lib/mongodb';
import { Loader2, Construction } from 'lucide-react';

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
                Coming Soon
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
                House Churches
              </h2>
            </div>
            
            {/* Under Construction Message */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-church-blue-light/20">
                <div className="p-8 text-center">
                  <div className="flex justify-center mb-6">
                    <Construction className="h-16 w-16 text-church-gold" />
                  </div>
                  <h3 className="text-2xl font-bold text-church-neutral-900 mb-4">HOUSE CHURCHES STILL BEING UPDATED</h3>
                  <p className="text-lg text-church-neutral-700 mb-6">
                    We're currently updating our house church information to serve you better. 
                    Please check back later for the latest groups and meeting details.
                  </p>
                  <div className="flex justify-center">
                    <img 
                      src="/placeholder.svg" 
                      alt="Under Construction" 
                      className="max-w-full h-auto rounded-lg shadow-md"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                  <div className="mt-8">
                    <Link to="/contact" className="btn-primary inline-block">
                      Contact Us For More Information
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HouseChurch;
