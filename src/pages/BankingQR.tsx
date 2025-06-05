
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BankingDetailsCard from '@/components/events/BankingDetailsCard';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BankingQR = () => {
  const [searchParams] = useSearchParams();
  const eventTitle = searchParams.get('event') || 'Payment';
  const amount = searchParams.get('amount') || 'P250';

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <section className="py-8 bg-church-blue text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex items-center justify-center mb-4">
                <QrCode className="h-8 w-8 mr-3" />
                <span className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium text-church-blue">
                  Banking QR Code
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {eventTitle}
              </h1>
              <p className="text-lg text-white/90">
                Scan the QR code below to make your payment of {amount}
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto">
              <Button 
                variant="outline" 
                onClick={goBack}
                className="mb-6 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>

              <BankingDetailsCard 
                eventTitle={eventTitle}
                registrationFee={amount}
              />
              
              <Card className="mt-6 border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="text-center text-sm text-blue-800">
                    <p className="font-semibold mb-2">Instructions:</p>
                    <ol className="text-left space-y-1 list-decimal list-inside">
                      <li>Scan the QR code with your banking app</li>
                      <li>Or manually enter the banking details</li>
                      <li>Use your name + "{eventTitle}" as reference</li>
                      <li>Transfer the amount: {amount}</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default BankingQR;
