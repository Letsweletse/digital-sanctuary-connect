
import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PhoneCall, Mail, ChevronDown, ChevronUp, Award, Play } from 'lucide-react';

interface PastorCardProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  email?: string;
  phone?: string;
  sermons?: Array<{ title: string; url: string }>;
}

const PastorCard: React.FC<PastorCardProps> = ({
  name,
  role,
  image,
  bio,
  email,
  phone,
  sermons
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  return (
    <Card className="overflow-hidden shadow-lg bg-transparent border-0 text-[#24324b]">
      <div className="md:flex">
        {/* Pastor Image */}
        <div className="md:w-1/3 relative">
          <div className="aspect-[3/4] relative overflow-hidden">
            <img
              src={image}
              alt={name}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            />
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-pulse w-16 h-16 rounded-full bg-gray-200"></div>
              </div>
            )}
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <Avatar className="w-20 h-20 bg-gray-200">
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-gray-200 to-gray-300 text-[#24324b]">
                    {name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <div className="absolute top-0 left-0 bg-[#e6c98f]/80 text-[#24324b] px-3 py-1.5 font-medium text-sm rounded-br-lg flex items-center">
              <Award className="h-4 w-4 mr-1.5" /> {role}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="md:w-2/3 p-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-[#24324b] mb-1">{name}</h1>
              <div className="h-1 w-16 bg-gradient-to-r from-[#e6c98f] to-[#f0d9a5]"></div>
            </div>
            
            <div className={`prose max-w-none text-gray-600 ${isExpanded ? 'max-h-none' : 'max-h-48 overflow-hidden relative'}`}>
              <div dangerouslySetInnerHTML={{ __html: bio }} />
              {!isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
              )}
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 text-[#e6c98f] hover:text-[#f0d9a5] font-medium transition-colors"
            >
              <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-[#e6c98f]" />
                  <a href={`mailto:${email}`} className="text-gray-600 hover:text-[#e6c98f] transition-colors">
                    {email}
                  </a>
                </div>
              )}
              
              {phone && (
                <div className="flex items-center space-x-2">
                  <PhoneCall className="w-5 h-5 text-[#e6c98f]" />
                  <a href={`tel:${phone}`} className="text-gray-600 hover:text-[#e6c98f] transition-colors">
                    {phone}
                  </a>
                </div>
              )}
            </div>
            
            {sermons && sermons.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-[#24324b] mb-3 flex items-center">
                  <Play className="h-4 w-4 mr-2 text-[#e6c98f]" />
                  Recent Sermons
                </h3>
                <ul className="space-y-3 bg-church-neutral-50 p-3 rounded-lg border border-[#e6c98f]/10">
                  {sermons.map((sermon, index) => (
                    <li key={index} className="bg-white p-2 rounded-md shadow-sm hover:shadow transition-shadow">
                      <a 
                        href={sermon.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-600 hover:text-[#e6c98f] flex items-center transition-colors group"
                      >
                        <div className="mr-3 bg-[#e6c98f]/10 text-[#e6c98f] rounded-full p-1.5 group-hover:bg-[#e6c98f]/20 transition-colors">
                          <Play className="h-4 w-4" />
                        </div>
                        <span className="line-clamp-2 text-sm font-medium">{sermon.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PastorCard;
