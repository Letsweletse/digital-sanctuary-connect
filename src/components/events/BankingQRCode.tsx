
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, CreditCard } from 'lucide-react';

interface BankingQRCodeProps {
  eventTitle: string;
  registrationFee?: string;
  size?: number;
  className?: string;
}

const BankingQRCode: React.FC<BankingQRCodeProps> = ({ 
  eventTitle, 
  registrationFee = "P250",
  size = 160,
  className = '' 
}) => {
  // Clean banking details format - no brackets or commas
  const qrData = `Account Name: Gate Gaborone
Bank: FNB
Branch: FNB Kgale
Branch Number: 284567
Account Number: 62767853213
Amount: ${registrationFee}
Reference: ${eventTitle}`;

  return (
    <Card className={`w-full max-w-sm mx-auto overflow-hidden border-amber-200 bg-amber-50/50 ${className}`}>
      <CardContent className="p-4 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-3">
          <QrCode className="h-5 w-5 text-amber-700" />
          <span className="text-sm font-semibold text-amber-800">Banking Details</span>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm w-full flex justify-center">
          <div className="relative">
            <QRCodeSVG 
              value={qrData} 
              size={Math.min(size, 200)} 
              level="H" 
              includeMargin={true}
              className="block max-w-full h-auto"
              style={{ 
                width: '100%', 
                height: 'auto',
                maxWidth: `${Math.min(size, 200)}px`,
                display: 'block'
              }}
            />
          </div>
        </div>
        
        <div className="text-center mt-3 w-full">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CreditCard className="h-4 w-4 text-amber-700" />
            <span className="text-sm font-semibold text-amber-800">{registrationFee}</span>
          </div>
          <p className="text-xs text-amber-700">
            Scan for banking details
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankingQRCode;
