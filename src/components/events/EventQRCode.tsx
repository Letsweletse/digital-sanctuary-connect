
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
  // If it's a location URL, ensure we use the updated Google Maps URL
  let formattedValue = value;
  
  // If the value contains old location URLs, replace with the updated one
  if (value.includes('maps.app.goo.gl') && !value.includes('Y5BPKfURyqQJ8EuXA')) {
    // Replace with the updated Google Maps URL
    formattedValue = "https://maps.app.goo.gl/tKHAW2wV6sZ2yLy96";
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
