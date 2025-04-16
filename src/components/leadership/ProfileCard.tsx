
import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, PhoneCall, ChevronDown, ChevronUp, User } from 'lucide-react';

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
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-100 rounded-lg text-gray-800 group">
      {/* Image with subtle hover effect */}
      <div className="relative overflow-hidden pb-[75%]">
        <img
          src={image}
          alt={name}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        />
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-pulse w-12 h-12 rounded-full bg-gray-200"></div>
          </div>
        )}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Avatar className="w-16 h-16 bg-gray-200 text-[#24324b]">
              <AvatarFallback className="bg-gray-200 text-[#24324b]">
                {name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        
        {/* Role badge with simple design */}
        <div className="absolute top-0 left-0 bg-[#24324b]/90 text-white px-3 py-1.5 font-medium text-sm rounded-br-lg flex items-center">
          <User className="h-4 w-4 mr-1.5" /> {role}
        </div>
      </div>
      
      {/* Content with clean styling */}
      <CardContent className="p-5 bg-white">
        <h3 className="text-xl font-bold text-[#24324b] mb-2 group-hover:text-[#24324b]/80 transition-colors duration-300">{name}</h3>
        <div className="h-0.5 w-12 bg-[#24324b] mb-3 group-hover:w-16 transition-all duration-300"></div>
        
        <div className={`relative overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-24'}`}>
          <div className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: bio }} />
          {!isExpanded && bio.length > 100 && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
          )}
        </div>
        
        {bio.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-[#24324b] hover:text-[#24324b]/80 mt-2 text-sm font-medium transition-colors"
          >
            <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
        
        {(email || phone) && (
          <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
            {email && (
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#24324b]" />
                <a href={`mailto:${email}`} className="text-sm text-gray-600 hover:text-[#24324b] transition-colors">
                  {email}
                </a>
              </div>
            )}
            
            {phone && (
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-[#24324b]" />
                <a href={`tel:${phone}`} className="text-sm text-gray-600 hover:text-[#24324b] transition-colors">
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
