import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { attendeeTitles } from '@/types/eventTypes';

interface PersonalInfoFieldsProps {
  title: string;
  name: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({
  title,
  name,
  onInputChange
}) => {
  return (
    <>
      {/* Title selection */}
      <div className="grid gap-2">
        <Label htmlFor="title" className="flex items-center gap-2 text-base">
          Title
        </Label>
        <select
          id="title"
          name="title"
          value={title}
          onChange={onInputChange}
          className="flex h-10 w-full rounded-md border border-church-blue-light bg-background px-3 py-2 text-base transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-church-blue"
        >
          {attendeeTitles.map((titleOption) => (
            <option key={titleOption} value={titleOption}>{titleOption}</option>
          ))}
        </select>
      </div>
      
      {/* Full Name field */}
      <div className="grid gap-2">
        <Label htmlFor="name" className="flex items-center gap-2 text-base">
          <User className="h-4 w-4 text-church-blue" />
          Full Name
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your full name"
          value={name}
          onChange={onInputChange}
          required
          className="border-church-blue-light focus-visible:ring-church-blue text-base transition-all duration-300"
        />
      </div>
    </>
  );
};

export default PersonalInfoFields;
