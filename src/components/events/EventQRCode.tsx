
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
  size = 150, 
  title = 'Your QR Ticket',
  className = '' 
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-3">
          <Ticket className="h-4 w-4 text-church-blue" />
          <span className="text-sm font-medium text-church-neutral-700">{title}</span>
        </div>
        
        <QRCodeSVG 
          value={value} 
          size={size} 
          level="H" 
          includeMargin={true}
          className="rounded-md shadow-sm"
        />
        
        <p className="text-xs text-church-neutral-500 mt-3 text-center">
          Scan for event verification
        </p>
      </CardContent>
    </Card>
  );
};

export default EventQRCode;
