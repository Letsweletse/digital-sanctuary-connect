
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, CreditCard, Hash, MapPin, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import BankingQRCode from './BankingQRCode';

interface BankingDetailsCardProps {
  eventTitle: string;
  registrationFee?: string;
}

const BankingDetailsCard: React.FC<BankingDetailsCardProps> = ({ 
  eventTitle, 
  registrationFee = "P250" 
}) => {
  const { toast } = useToast();

  const bankingDetails = {
    accountName: "Gate Gaborone",
    branchName: "FNB Kgale",
    branchNumber: "284567",
    accountNumber: "62767853213"
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
      duration: 2000,
    });
  };

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </CardTitle>
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            Fee: {registrationFee}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-amber-700 mb-4">
          <p className="font-medium">Payment is required to complete registration for {eventTitle}</p>
          <p>Please transfer to the following bank account:</p>
        </div>
        
        {/* QR Code Section */}
        <div className="flex justify-center mb-4">
          <BankingQRCode 
            eventTitle={eventTitle}
            registrationFee={registrationFee}
            size={140}
          />
        </div>
        
        <div className="text-center mb-4">
          <p className="text-sm text-amber-700 font-medium">
            Scan QR code above or use manual details below
          </p>
        </div>
        
        <div className="grid gap-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-amber-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Account Name</div>
                <div className="text-sm text-gray-600">{bankingDetails.accountName}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(bankingDetails.accountName, "Account Name")}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-amber-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Branch Name</div>
                <div className="text-sm text-gray-600">{bankingDetails.branchName}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(bankingDetails.branchName, "Branch Name")}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
            <div className="flex items-center gap-3">
              <Hash className="h-4 w-4 text-amber-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Branch Number</div>
                <div className="text-sm text-gray-600">{bankingDetails.branchNumber}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(bankingDetails.branchNumber, "Branch Number")}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-amber-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Account Number</div>
                <div className="text-sm text-gray-600 font-mono">{bankingDetails.accountNumber}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(bankingDetails.accountNumber, "Account Number")}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="bg-amber-100 border border-amber-300 rounded-lg p-3 mt-4">
          <p className="text-xs text-amber-800">
            <strong>Reference:</strong> Use your name and "{eventTitle}" as the payment reference.
            After payment, complete the registration form above.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankingDetailsCard;
