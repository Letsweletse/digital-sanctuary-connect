
import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, PhoneCall, ChevronDown, ChevronUp } from 'lucide-react';

interface ProfileCardProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  email?: string;
  phone?: string;
  featured?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  role,
  image,
  bio,
  email,
  phone,
  featured = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative pb-[75%]">
        <img
          src={image}
          alt={name}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`absolute top-0 left-0 w-full h-full object-cover ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        />
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-pulse w-12 h-12 rounded-full bg-gray-200"></div>
          </div>
        )}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Avatar className="w-16 h-16">
              <AvatarFallback>
                {name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
      
      {/* Content */}
      <CardContent className="p-5">
        <span className="inline-block bg-indigo-100 px-3 py-1 rounded-full text-xs font-medium text-indigo-700 mb-2">
          {role}
        </span>
        <h3 className="text-xl font-bold text-black mb-2">{name}</h3>
        
        <div className={`relative overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-24'}`}>
          <div className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: bio }} />
          {!isExpanded && bio.length > 100 && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
          )}
        </div>
        
        {bio.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 mt-2 text-sm font-medium transition-colors"
          >
            <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
        
        {(email || phone) && (
          <div className="mt-4 space-y-2">
            {email && (
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-indigo-500" />
                <a href={`mailto:${email}`} className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                  {email}
                </a>
              </div>
            )}
            
            {phone && (
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-indigo-500" />
                <a href={`tel:${phone}`} className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                  {phone}
                </a>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
