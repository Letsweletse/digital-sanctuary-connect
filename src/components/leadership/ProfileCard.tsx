
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface ProfileCardProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  email?: string;
  sermons?: Array<{ title: string; url: string }>;
  isSeniorPastor?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  role,
  image,
  bio,
  email,
  sermons,
  isSeniorPastor = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={`glass-panel overflow-hidden transition-all duration-300 ${isSeniorPastor ? 'col-span-1 md:col-span-2 lg:col-span-3' : ''}`}>
      <div className={`flex flex-col ${isSeniorPastor ? 'md:flex-row' : ''}`}>
        {/* Image */}
        <div className={`${isSeniorPastor ? 'md:w-1/3' : 'w-full'}`}>
          <div className="relative pb-[100%]">
            <img
              src={image}
              alt={name}
              className="absolute top-0 left-0 w-full h-full object-cover object-center"
            />
          </div>
        </div>
        
        {/* Content */}
        <div className={`p-6 ${isSeniorPastor ? 'md:w-2/3' : 'w-full'}`}>
          <span className="inline-block bg-church-blue-light px-3 py-1 rounded-full text-xs font-medium text-church-neutral-700 mb-3">
            {role}
          </span>
          <h3 className="text-2xl font-bold text-church-neutral-900 mb-2">{name}</h3>
          
          <div className={`relative overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-20'}`}>
            <p className="text-church-neutral-700">{bio}</p>
            {!isExpanded && <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>}
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-church-blue-dark hover:text-church-gold mt-2 text-sm font-medium transition-colors"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
          
          {isSeniorPastor && sermons && sermons.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-church-neutral-900 mb-3">Recent Sermons</h4>
              <ul className="space-y-2">
                {sermons.map((sermon, index) => (
                  <li key={index}>
                    <Link 
                      to={sermon.url} 
                      className="text-church-neutral-700 hover:text-church-gold flex items-center transition-colors"
                    >
                      <svg 
                        className="w-4 h-4 mr-2 text-church-gold" 
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
          
          <div className="mt-6">
            <a 
              href={`mailto:${email || 'info@gracecommunity.org'}`}
              className="btn-primary inline-flex items-center"
            >
              <svg 
                className="w-4 h-4 mr-2" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Contact for Prayer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
