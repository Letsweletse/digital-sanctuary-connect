
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent } from '@/components/ui/card';
import { Ticket } from 'lucide-react';

interface EventQRCodeProps {
  value: string;
  size?: number;
  title?: string;
  className?: string;
}

const EventQRCode: React.FC<EventQRCodeProps> = ({ 
  value, 
  size = 180, 
  title = 'Your QR Ticket',
  className = '' 
}) => {
  // Ensure QR code value is properly formatted for scanning
  // If it's a location URL, ensure we use a direct Google Maps URL, not a shortened one
  let formattedValue = value;
  
  // If the value contains "maps.app.goo.gl" or other shortened URLs, replace with direct URL
  if (value.includes('maps.app.goo.gl') || value.includes('goo.gl')) {
    // Replace with direct Google Maps URL
    formattedValue = "https://www.google.com/maps/place/Gate+Gaborone/@-24.6618567,25.9048083,15z/data=!4m6!3m5!1s0x1ebb5b26225a6213:0xaed9e468c1e4ef31!8m2!3d-24.6618567!4d25.9048083!16s%2Fg%2F11q89m2yrq";
  }
  
  return (
    <Card className={`overflow-hidden shadow-lg border border-[#24324b]/10 ${className}`}>
      <CardContent className="p-6 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4">
          <Ticket className="h-5 w-5 text-[#24324b]" />
          <span className="text-base font-medium font-montserrat text-church-neutral-700">{title}</span>
        </div>
        
        <QRCodeSVG 
          value={formattedValue} 
          size={size} 
          level="H" 
          includeMargin={true}
          className="rounded-md shadow-md p-2 bg-white border border-[#24324b]/10"
        />
        
        <p className="text-sm font-montserrat text-church-neutral-600 mt-4 text-center font-medium">
          Scan for event check-in
        </p>
      </CardContent>
    </Card>
  );
};

export default EventQRCode;
