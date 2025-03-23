
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MediaSection from '@/components/home/MediaSection';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '5986###') {
      setAuthenticated(true);
      toast({
        title: "Access granted",
        description: "Welcome to the admin panel",
      });
    } else {
      toast({
        title: "Access denied",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 page-transition">
        <section className="py-16 bg-church-blue text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium text-church-blue mb-4">
                Admin Area
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Media Management
              </h1>
              <p className="text-lg text-white/90">
                This area is for church administrators to manage media content.
              </p>
            </div>
          </div>
        </section>
        
        {!authenticated ? (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-md mx-auto glass-panel p-8">
                <h2 className="text-2xl font-bold text-church-neutral-900 mb-6">
                  Admin Login
                </h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-church-neutral-700 mb-1">
                      Password
                    </label>
                    <Input 
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="w-full"
                    />
                  </div>
                  <Button type="submit" className="w-full btn-primary">
                    Login
                  </Button>
                </form>
              </div>
            </div>
          </section>
        ) : (
          <MediaSection />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
