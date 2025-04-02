
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface ProfileCardProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  email?: string;
  phone?: string;
  sermons?: Array<{ title: string; url: string }>;
  isSeniorPastor?: boolean;
  featured?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  role,
  image,
  bio,
  email,
  phone,
  sermons,
  isSeniorPastor = false,
  featured = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={`glass-panel overflow-hidden transition-all duration-300 ${featured || isSeniorPastor ? 'col-span-1 md:col-span-2 lg:col-span-3' : ''}`}>
      <div className={`flex flex-col ${featured || isSeniorPastor ? 'md:flex-row' : ''}`}>
        {/* Image */}
        <div className={`${featured || isSeniorPastor ? 'md:w-1/3' : 'w-full'}`}>
          <div className="relative pb-[100%]">
            <img
              src={image}
              alt={name}
              className="absolute top-0 left-0 w-full h-full object-cover object-center"
            />
          </div>
        </div>
        
        {/* Content */}
        <div className={`p-6 ${featured || isSeniorPastor ? 'md:w-2/3' : 'w-full'}`}>
          <span className="inline-block bg-indigo-100 px-3 py-1 rounded-full text-xs font-medium text-indigo-700 mb-3">
            {role}
          </span>
          <h3 className="text-2xl font-bold text-black mb-2">{name}</h3>
          
          <div className={`relative overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-20'}`}>
            <div dangerouslySetInnerHTML={{ __html: bio }} />
            {!isExpanded && <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>}
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-indigo-600 hover:text-indigo-800 mt-2 text-sm font-medium transition-colors"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
          
          {email && (
            <div className="mt-3 text-sm text-gray-600">
              <strong>Email:</strong> {email}
            </div>
          )}
          
          {phone && (
            <div className="mt-1 text-sm text-gray-600">
              <strong>Phone:</strong> {phone}
            </div>
          )}
          
          {(featured || isSeniorPastor) && sermons && sermons.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-black mb-3">Recent Sermons</h4>
              <ul className="space-y-2">
                {sermons.map((sermon, index) => (
                  <li key={index}>
                    <Link 
                      to={sermon.url} 
                      className="text-church-neutral-700 hover:text-indigo-600 flex items-center transition-colors"
                    >
                      <svg 
                        className="w-4 h-4 mr-2 text-indigo-500" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                      {sermon.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
