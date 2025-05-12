
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play } from 'lucide-react';
import { format } from 'date-fns';
import { Sermon } from '@/types/sermonTypes';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface CollapsibleSermonSectionProps {
  title: string;
  sermons: Sermon[];
  image: string;
}

const CollapsibleSermonSection = ({ title, sermons, image }: CollapsibleSermonSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-church-neutral-200 overflow-hidden mb-8 bg-white">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <div className="flex items-center cursor-pointer p-4 bg-church-blue-light/10 hover:bg-church-blue-light/20 transition-colors">
            <div className="flex-1 flex items-center gap-3">
              <img 
                src={image} 
                alt={title} 
                className="w-12 h-12 object-cover rounded-md"
              />
              <div>
                <h3 className="font-bold text-lg text-church-blue-dark">{title}</h3>
                <p className="text-sm text-church-neutral-600">{sermons.length} sessions available</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="ml-2">
              {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="divide-y divide-church-neutral-100">
            {sermons.map((sermon) => (
              <div key={sermon.id} className="p-4 hover:bg-church-neutral-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 rounded">
                    <AvatarImage src={sermon.speakerImage} alt={sermon.speaker} />
                    <AvatarFallback>{sermon.speaker?.charAt(0) || 'S'}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-church-neutral-900">{sermon.title}</h4>
                    <div className="flex flex-wrap text-xs text-church-neutral-500 mt-1 gap-x-3">
                      <span>{sermon.speaker}</span>
                      <span>•</span>
                      <span>{format(new Date(sermon.date), 'MMMM d, yyyy')}</span>
                      <span>•</span>
                      <span>{sermon.duration}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-church-blue flex items-center gap-1"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Listen
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CollapsibleSermonSection;
