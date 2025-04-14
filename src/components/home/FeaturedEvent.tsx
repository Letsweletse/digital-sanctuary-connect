
import React from 'react';
import { EventData } from '@/types/eventTypes';
import { formatDate } from '@/utils/dateUtils';
import { Share2, Facebook, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';

interface FeaturedEventProps {
  featuredEvent: EventData;
  onRegisterClick: () => void;
}

const FeaturedEvent: React.FC<FeaturedEventProps> = ({ 
  featuredEvent,
  onRegisterClick 
}) => {
  const churchUrl = "https://gategaborone.com";
  const shareText = `Join us for ${featuredEvent.title}! Register here: ${churchUrl}/events`;
  
  // Different sharing links with branding controlled by our domain
  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(churchUrl + '/events')}&quote=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(churchUrl + '/events')}&summary=${encodeURIComponent(shareText)}`,
    email: `mailto:?subject=${encodeURIComponent(featuredEvent.title)}&body=${encodeURIComponent(`${shareText}\n\nDate: ${formatDate(featuredEvent.date)}\nTime: ${featuredEvent.time}\nLocation: ${featuredEvent.location}`)}`
  };

  // Handle sharing to various platforms
  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank');
  };

  // Format multi-day event dates
  const getEventDateDisplay = () => {
    if (featuredEvent.endDate) {
      return `${formatDate(featuredEvent.date)} - ${formatDate(featuredEvent.endDate)}`;
    }
    return formatDate(featuredEvent.date);
  };

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-14">
          <span className="inline-block bg-blue-500 px-4 py-2 rounded-full text-lg font-semibold text-white shadow-lg">
            Featured Event
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-6 leading-tight">
            {featuredEvent.title}
          </h2>
          <p className="max-w-3xl mx-auto text-lg opacity-80 mt-4">
            Join us for this exclusive experience featuring renowned speakers, impactful workshops, and transformative fellowship.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="h-full">
            <img 
              src={featuredEvent.image}
              alt={featuredEvent.title}
              className="w-full h-full object-contain rounded-l-xl"
            />
          </div>
          <div className="p-8">
            <div className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-3 bg-blue-500 text-white shadow-lg">
              {featuredEvent.category.charAt(0).toUpperCase() + featuredEvent.category.slice(1)}
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{featuredEvent.title}</h3>
            <p className="text-white/80 mb-4 text-lg">
              {getEventDateDisplay()} at {featuredEvent.time} | {featuredEvent.location}
            </p>
            <p className="text-lg opacity-80 leading-relaxed mb-4">
              {featuredEvent.description}
            </p>
            
            <div className="flex flex-wrap gap-5 mb-6">
              <a 
                href={featuredEvent.registrationLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
              >
                Register Now
              </a>
              
              {/* Social sharing section */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg shadow-md"
                  aria-label="Share to WhatsApp"
                >
                  <Share2 size={20} />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-lg shadow-md"
                  aria-label="Share to Facebook"
                >
                  <Facebook size={20} />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="bg-black hover:bg-gray-800 text-white p-3 rounded-lg shadow-md"
                  aria-label="Share to Twitter/X"
                >
                  <Twitter size={20} />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="bg-blue-800 hover:bg-blue-900 text-white p-3 rounded-lg shadow-md"
                  aria-label="Share to LinkedIn"
                >
                  <Linkedin size={20} />
                </button>
                <button
                  onClick={() => handleShare('email')}
                  className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg shadow-md"
                  aria-label="Share via Email"
                >
                  <Mail size={20} />
                </button>
              </div>
            </div>
            
            {/* Call to register information */}
            {featuredEvent.id === '6' && (
              <div className="mt-4 bg-gray-700 rounded-lg p-4">
                <h4 className="font-bold text-white mb-2">To Register:</h4>
                <p className="text-white/90">Call: <a href="tel:+260993181830" className="underline">0993181830</a> or <a href="tel:+260993749297" className="underline">0993749297</a></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvent;
