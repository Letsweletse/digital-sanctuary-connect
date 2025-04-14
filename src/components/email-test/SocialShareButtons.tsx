
import React from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Facebook, Twitter, Linkedin, Mail, Instagram } from "lucide-react";

interface SocialShareButtonsProps {
  lastSentId: string;
  handleShareToWhatsApp: () => void;
  handleShareToSocial: (platform: string) => void;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ 
  lastSentId, 
  handleShareToWhatsApp, 
  handleShareToSocial 
}) => {
  if (!lastSentId) return null;
  
  return (
    <div className="mt-4">
      <h3 className="font-bold text-lg mb-2">Share Event:</h3>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Button 
          onClick={handleShareToWhatsApp}
          className="bg-green-600 hover:bg-green-700 flex items-center justify-center gap-1"
        >
          <Share2 size={16} />
          WhatsApp
        </Button>
        <Button 
          onClick={() => handleShareToSocial('facebook')}
          className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-1"
        >
          <Facebook size={16} />
          Facebook
        </Button>
        <Button 
          onClick={() => handleShareToSocial('twitter')}
          className="bg-black hover:bg-gray-800 flex items-center justify-center gap-1"
        >
          <Twitter size={16} />
          Twitter
        </Button>
        <Button 
          onClick={() => handleShareToSocial('linkedin')}
          className="bg-blue-800 hover:bg-blue-900 flex items-center justify-center gap-1"
        >
          <Linkedin size={16} />
          LinkedIn
        </Button>
        <Button 
          onClick={() => handleShareToSocial('instagram')}
          className="bg-pink-600 hover:bg-pink-700 flex items-center justify-center gap-1"
        >
          <Instagram size={16} />
          Instagram
        </Button>
        <Button 
          onClick={() => handleShareToSocial('email')}
          className="bg-gray-600 hover:bg-gray-700 flex items-center justify-center gap-1"
        >
          <Mail size={16} />
          Email
        </Button>
      </div>
    </div>
  );
};

export default SocialShareButtons;
