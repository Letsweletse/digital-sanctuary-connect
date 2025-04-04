
import React from 'react';
import Layout from '@/components/layout/Layout';
import SermonGrid from '@/components/sermons/SermonGrid';
import YouTubeEmbed from '@/components/media/YouTubeEmbed';
import { CalendarDays, Headphones, MicVocal, VideoIcon } from 'lucide-react';
import AudioSermonPlayer from '@/components/media/AudioSermonPlayer';

const Sermons = () => {
  return (
    <Layout>
      <main className="flex-grow pt-16 md:pt-24 page-transition">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-church-blue to-church-blue-dark py-16 md:py-24 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=1470&auto=format&fit=crop')] opacity-20 bg-cover bg-center"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium text-white mb-4">
                Word of God
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Sermons & Teachings
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Dive into our collection of sermons that bring biblical truth to life. 
                Explore teachings on faith, grace, and living out God's Word in today's world.
              </p>
            </div>
          </div>
        </section>
        
        {/* Featured Sermon */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-church-gold-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
                Featured Message
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
                Latest Sunday Sermon
              </h2>
              <p className="max-w-2xl mx-auto text-church-neutral-700">
                Watch our latest message delivered at Gate Gaborone.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto glass-panel p-2 md:p-6 shadow-xl rounded-xl overflow-hidden">
              <div className="aspect-video w-full rounded-lg overflow-hidden mb-6">
                <iframe 
                  className="w-full h-full" 
                  src="https://www.youtube.com/embed/PpSxcNgBOqM" 
                  title="He's Power In Us" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <div className="px-4">
                <h3 className="text-xl md:text-2xl font-bold text-church-neutral-900 mb-2">
                  He's Power In Us
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-church-neutral-700 mb-4">
                  <span className="flex items-center gap-1.5">
                    <MicVocal size={18} className="text-church-blue" />
                    Peter Taylor
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={18} className="text-church-blue" />
                    March 30, 2025
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Content Tabs Section */}
        <section className="py-16 bg-church-neutral-50/70">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
                <div className="md:w-1/3 sticky top-24">
                  <div className="glass-panel p-6 bg-white/90 rounded-xl shadow-md mb-6">
                    <h3 className="text-xl font-bold text-church-neutral-900 mb-4 flex items-center gap-2">
                      <Headphones className="w-5 h-5 text-church-blue" />
                      Listen Now
                    </h3>
                    <AudioSermonPlayer />
                  </div>
                  
                  <div className="glass-panel p-6 bg-white/90 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-church-neutral-900 mb-4 flex items-center gap-2">
                      <VideoIcon className="w-5 h-5 text-church-blue" />
                      YouTube Channel
                    </h3>
                    <p className="text-church-neutral-700 mb-4">
                      Subscribe to our YouTube channel to stay updated with all our latest videos and live streams.
                    </p>
                    <a 
                      href="https://www.youtube.com/@gategaboronebotswana2702"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      Subscribe
                    </a>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="glass-panel p-6 bg-white/90 rounded-xl shadow-md mb-8">
                    <h3 className="text-xl font-bold text-church-neutral-900 mb-6 flex items-center gap-2">
                      <VideoIcon className="w-5 h-5 text-church-blue" />
                      Video Archive
                    </h3>
                    <YouTubeEmbed channelId="gategaboronebotswana2702" maxResults={4} />
                  </div>
                  
                  <div className="glass-panel p-6 bg-white/90 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-church-neutral-900 mb-6 flex items-center gap-2">
                      <Headphones className="w-5 h-5 text-church-blue" />
                      Audio Sermons
                    </h3>
                    <div className="text-center py-8">
                      <p className="text-church-neutral-700 mb-4">
                        Browse our complete collection of audio sermons to listen on-demand.
                      </p>
                      <a 
                        href="#sermon-library" 
                        className="inline-flex items-center gap-2 bg-church-blue hover:bg-church-blue-dark text-white px-4 py-2 rounded-md transition-colors"
                      >
                        <Headphones className="w-4 h-4" />
                        Browse Audio Sermons
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Sermon Archives */}
        <section id="sermon-library" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-church-blue-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
                Browse & Search
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
                Sermon Library
              </h2>
              <p className="max-w-2xl mx-auto text-church-neutral-700">
                Explore our complete sermon archive. Search by topic, speaker, or date to find exactly what you're looking for.
              </p>
            </div>
            
            <SermonGrid />
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Sermons;
