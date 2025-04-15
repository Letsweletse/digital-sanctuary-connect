
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
  return (
    <Card className={`overflow-hidden shadow-lg border border-[#24324b]/10 ${className}`}>
      <CardContent className="p-6 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4">
          <Ticket className="h-5 w-5 text-[#24324b]" />
          <span className="text-base font-medium font-montserrat text-church-neutral-700">{title}</span>
        </div>
        
        <QRCodeSVG 
          value={value} 
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
