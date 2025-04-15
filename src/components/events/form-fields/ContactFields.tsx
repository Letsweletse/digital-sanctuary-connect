
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail, Phone } from "lucide-react";
import { countryCodes } from '@/types/eventTypes';

interface ContactFieldsProps {
  email: string;
  countryCode: string;
  phone: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const ContactFields: React.FC<ContactFieldsProps> = ({
  email,
  countryCode,
  phone,
  onInputChange
}) => {
  // Helper function to format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, remove any other characters
    const cleaned = e.target.value.replace(/\D/g, '');
    
    // Create a modified event object with the cleaned value
    const modifiedEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'phone',
        value: cleaned
      }
    };
    
    // Pass the modified event to the parent handler
    onInputChange(modifiedEvent);
  };

  return (
    <>
      {/* Email field */}
      <div className="grid gap-2">
        <Label htmlFor="email" className="flex items-center gap-2 text-base">
          <Mail className="h-4 w-4 text-church-blue" />
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={onInputChange}
          required
          className="border-church-blue-light focus-visible:ring-church-blue text-base transition-all duration-300"
        />
      </div>
      
      {/* Phone with country code */}
      <div className="grid gap-2">
        <Label htmlFor="phone" className="flex items-center gap-2 text-base">
          <Phone className="h-4 w-4 text-church-blue" />
          Phone Number <span className="text-xs text-gray-500">(WhatsApp enabled)</span>
        </Label>
        <div className="flex space-x-2">
          <select
            id="countryCode"
            name="countryCode"
            value={countryCode}
            onChange={onInputChange}
            className="flex h-10 w-2/5 rounded-md border border-church-blue-light bg-background px-3 py-2 text-sm md:text-base transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-church-blue"
          >
            {countryCodes.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.code} ({country.country})
              </option>
            ))}
          </select>
          <Input
            id="phone"
            name="phone"
            placeholder="7XXXXXXX (digits only)"
            value={phone}
            onChange={handlePhoneChange}
            required
            className="border-church-blue-light focus-visible:ring-church-blue text-sm md:text-base transition-all duration-300 w-3/5"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Example: For Botswana (+267) enter 71234567 without spaces or symbols
        </p>
      </div>
    </>
  );
};

export default ContactFields;
