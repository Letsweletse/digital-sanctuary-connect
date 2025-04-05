
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User, Building, Users } from "lucide-react";
import { attendeeRoles } from '@/types/eventTypes';

interface ChurchInfoFieldsProps {
  role: string;
  denomination: string;
  numberOfAttendees: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const ChurchInfoFields: React.FC<ChurchInfoFieldsProps> = ({
  role,
  denomination,
  numberOfAttendees,
  onInputChange
}) => {
  return (
    <>
      {/* Role selection */}
      <div className="grid gap-2">
        <Label htmlFor="role" className="flex items-center gap-2 text-base">
          <User className="h-4 w-4 text-church-blue" />
          Your Role
        </Label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={onInputChange}
          required
          className="flex h-10 w-full rounded-md border border-church-blue-light bg-background px-3 py-2 text-base transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-church-blue"
        >
          {attendeeRoles.map((roleOption) => (
            <option key={roleOption} value={roleOption}>{roleOption}</option>
          ))}
        </select>
      </div>
      
      {/* Denomination field */}
      <div className="grid gap-2">
        <Label htmlFor="denomination" className="flex items-center gap-2 text-base">
          <Building className="h-4 w-4 text-church-blue" />
          Denomination / Church
        </Label>
        <Input
          id="denomination"
          name="denomination"
          placeholder="Enter your denomination or church"
          value={denomination}
          onChange={onInputChange}
          required
          className="border-church-blue-light focus-visible:ring-church-blue text-base transition-all duration-300"
        />
      </div>
      
      {/* Number of Attendees field */}
      <div className="grid gap-2">
        <Label htmlFor="numberOfAttendees" className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4 text-church-blue" />
          Number of Attendees
        </Label>
        <Input
          id="numberOfAttendees"
          name="numberOfAttendees"
          type="number"
          min="1"
          value={numberOfAttendees}
          onChange={onInputChange}
          required
          className="border-church-blue-light focus-visible:ring-church-blue text-base transition-all duration-300"
        />
      </div>
    </>
  );
};

export default ChurchInfoFields;
