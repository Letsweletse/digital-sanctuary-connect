import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MediaSection from '@/components/home/MediaSection';
import ImageUploader from '@/components/media/ImageUploader';
import LogoUploader from '@/components/media/LogoUploader';
import SermonManager from '@/components/media/SermonManager';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogoProvider } from '@/components/layout/LogoContext';
import EmailTest from '@/components/EmailTest';

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
    <LogoProvider>
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
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <Tabs defaultValue="logo" className="w-full">
                  <TabsList className="mb-8">
                    <TabsTrigger value="logo">Church Logo</TabsTrigger>
                    <TabsTrigger value="leadership">Leadership Photos</TabsTrigger>
                    <TabsTrigger value="sermons">Sermon Management</TabsTrigger>
                    <TabsTrigger value="images">General Images</TabsTrigger>
                    <TabsTrigger value="audio">Audio Sermons</TabsTrigger>
                    <TabsTrigger value="youtube">YouTube Videos</TabsTrigger>
                    <TabsTrigger value="email-test">Email Test</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="logo" className="space-y-8">
                    <div className="glass-panel">
                      <LogoUploader />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="leadership" className="space-y-8">
                    <div className="glass-panel p-8">
                      <h2 className="text-2xl font-bold text-church-neutral-900 mb-6">
                        Leadership Photos Management
                      </h2>
                      <p className="text-church-neutral-700 mb-6">
                        Upload and manage photos of church leadership team members. These images will appear on the Leadership page.
                      </p>
                      <ImageUploader />
                    </div>
                  </TabsContent>

                  <TabsContent value="sermons" className="space-y-8">
                    <div className="glass-panel p-8">
                      <h2 className="text-2xl font-bold text-church-neutral-900 mb-6">
                        Sermon Management
                      </h2>
                      <p className="text-church-neutral-700 mb-6">
                        Upload and manage sermons with speaker photos, audio files, and details. These will appear on the Sermons page.
                      </p>
                      <SermonManager />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="images" className="space-y-8">
                    <ImageUploader />
                  </TabsContent>
                  
                  <TabsContent value="audio">
                    <MediaSection />
                  </TabsContent>
                  
                  <TabsContent value="youtube">
                    <div className="glass-panel p-8">
                      <h2 className="text-2xl font-bold text-church-neutral-900 mb-6">
                        YouTube Channel Management
                      </h2>
                      <p className="text-church-neutral-700 mb-4">
                        This section allows you to manage YouTube videos that appear on the website.
                        The videos are pulled directly from the Gate Gaborone YouTube channel.
                      </p>
                      <div className="bg-church-neutral-100 p-4 rounded-md">
                        <p className="text-sm text-church-neutral-700">
                          Channel ID: <span className="font-mono">gategaboronebotswana2702</span>
                        </p>
                        <p className="text-sm text-church-neutral-500 mt-2">
                          To update videos, simply upload new content to your YouTube channel.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="email-test" className="space-y-8">
                    <div className="glass-panel p-8">
                      <h2 className="text-2xl font-bold text-church-neutral-900 mb-6">
                        Email Delivery Testing
                      </h2>
                      <p className="text-church-neutral-700 mb-6">
                        Use this tool to test email notifications and verify delivery systems.
                      </p>
                      <EmailTest />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </section>
          )}
        </main>
        
        <Footer />
      </div>
    </LogoProvider>
  );
};

export default Admin;
