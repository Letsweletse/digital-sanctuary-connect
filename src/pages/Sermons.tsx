
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SermonGrid from '@/components/sermons/SermonGrid';
import YouTubeEmbed from '@/components/media/YouTubeEmbed';
import SermonAudio from '@/components/media/SermonAudio';

const Sermons = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 page-transition">
        {/* Page Header */}
        <section className="bg-church-blue py-16 md:py-24 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium text-church-blue mb-4">
                Sermons & Teachings
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Weekly Messages
              </h1>
              <p className="text-lg text-white/90">
                Explore our sermon archive for teachings on faith, grace, and living out God's Word. 
                Watch online or subscribe to our YouTube channel for updates.
              </p>
            </div>
          </div>
        </section>
        
        {/* SermonAudio Integration */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-church-blue-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
                SermonAudio
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
                Listen to Our Sermons
              </h2>
              <p className="max-w-2xl mx-auto text-church-neutral-700">
                Access our sermons through SermonAudio's platform for high-quality audio recordings of our weekly messages.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto glass-panel p-6">
              <SermonAudio churchId="gategaborone" showLatest={true} count={5} />
            </div>
          </div>
        </section>
        
        {/* YouTube Videos */}
        <section className="py-16 bg-church-neutral-50">
          <div className="container mx-auto px-4">
            <YouTubeEmbed channelId="gategaboronebotswana2702" maxResults={6} />
          </div>
        </section>
        
        {/* Sermon Archives */}
        <section className="py-16 bg-church-neutral-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-church-gold-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
                Sermon Archive
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
                Browse Past Messages
              </h2>
              <p className="max-w-2xl mx-auto text-church-neutral-700">
                Search and filter our sermon archive by topic, speaker, or date.
              </p>
            </div>
            
            <SermonGrid />
            
            <div className="mt-12 text-center">
              <a 
                href="https://www.youtube.com/@gategaboronebotswana2702/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                View All Sermons on YouTube
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sermons;
