
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BankingQRCode from '@/components/events/BankingQRCode';
import { QrCode, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BankingQRManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('General Payment');
  const [registrationFee, setRegistrationFee] = useState('P250');
  const { toast } = useToast();

  const generateQRLink = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      event: eventTitle,
      amount: registrationFee
    });
    return `${baseUrl}/banking-qr?${params.toString()}`;
  };

  const copyQRLink = () => {
    const link = generateQRLink();
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied!",
      description: "Banking QR code link copied to clipboard",
      duration: 2000,
    });
  };

  const openQRLink = () => {
    const link = generateQRLink();
    window.open(link, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-church-neutral-900 mb-2">
            Banking QR Code Manager
          </h2>
          <p className="text-church-neutral-700">
            Generate shareable QR codes for banking details and payments.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventTitle">Event/Payment Title</Label>
              <Input
                id="eventTitle"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g., Conference Registration"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                value={registrationFee}
                onChange={(e) => setRegistrationFee(e.target.value)}
                placeholder="e.g., P250"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  Preview QR Code
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Banking QR Code</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center py-4">
                  <BankingQRCode 
                    eventTitle={eventTitle}
                    registrationFee={registrationFee}
                    size={200}
                  />
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              variant="outline" 
              onClick={copyQRLink}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy QR Link
            </Button>

            <Button 
              variant="outline" 
              onClick={openQRLink}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open QR Page
            </Button>
          </div>

          <div className="mt-4 p-3 bg-church-neutral-50 rounded-lg">
            <p className="text-sm text-church-neutral-600 mb-2">
              <strong>Generated Link:</strong>
            </p>
            <code className="text-xs bg-white p-2 rounded border block break-all">
              {generateQRLink()}
            </code>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Banking Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Account Name:</span>
              <span>Gate Gaborone</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Bank:</span>
              <span>FNB</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Branch:</span>
              <span>FNB Kgale</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Branch Number:</span>
              <span>284567</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Account Number:</span>
              <span className="font-mono">62767853213</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankingQRManager;
