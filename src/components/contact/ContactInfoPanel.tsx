
import React from 'react';

interface ContactInfoItemProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const ContactInfoItem = ({ icon, title, children }: ContactInfoItemProps) => (
  <div className="glass-panel p-6 flex">
    <div className="mr-4">
      <div className="w-12 h-12 bg-church-blue rounded-full flex items-center justify-center">
        {icon}
      </div>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-church-neutral-900 mb-2">{title}</h3>
      {children}
    </div>
  </div>
);

const ContactInfoPanel = () => {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-church-neutral-900 mb-8">
        How to Reach Us
      </h2>
      
      <div className="space-y-8">
        <ContactInfoItem 
          title="Our Location"
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          }
        >
          <p className="text-church-neutral-700">Gate Gaborone Auditorium</p>
          <p className="text-church-neutral-700">Gaborone West, Phase 4, Plot 54014</p>
        </ContactInfoItem>
        
        <ContactInfoItem 
          title="Email Us"
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-white" 
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
          }
        >
          <p className="text-church-neutral-700">General Information: info@gategaborone.co.bw</p>
        </ContactInfoItem>
        
        <ContactInfoItem 
          title="Call Us"
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          }
        >
          <p className="text-church-neutral-700">Main Office: +267 3500194</p>
          <p className="text-church-neutral-700">After Hours: +267 75507981</p>
        </ContactInfoItem>
        
        <ContactInfoItem 
          title="Service Times"
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          }
        >
          <p className="text-church-neutral-700">Sunday Services: 8:30 AM & 11:00 AM</p>
          <p className="text-church-neutral-700">Wednesday Housechurch: 6:30 PM - 8:00 PM</p>
        </ContactInfoItem>
      </div>
    </div>
  );
};

export default ContactInfoPanel;
