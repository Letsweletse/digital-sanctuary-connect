
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import DonationForm, { DonationFormValues } from '@/components/giving/DonationForm';
import LoginPrompt from '@/components/giving/LoginPrompt';
import ThankYouMessage from '@/components/giving/ThankYouMessage';

const Give = () => {
  const { toast } = useToast();
  const [showThankYou, setShowThankYou] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleSubmit = (data: DonationFormValues) => {
    console.log("Form submitted:", data);
    // In a real implementation, you would process the payment here
    // For now, we'll just show the thank you message
    setShowThankYou(true);
    toast({
      title: "Thank you for your donation!",
      description: "Your contribution makes a difference.",
      variant: "default",
    });
    
    // Reset the form after 3 seconds
    setTimeout(() => {
      setShowThankYou(false);
    }, 3000);
  };

  const toggleLoginPrompt = () => {
    setShowLoginPrompt(!showLoginPrompt);
  };

  const handleNewDonation = () => {
    setShowThankYou(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-church-blue-dark mb-4">Give to the Church</h1>
            <p className="text-lg text-church-neutral-600">
              Your generosity helps us spread the Gospel and serve our community.
            </p>
          </div>

          <Card className="border border-church-blue-light/20 shadow-md">
            <CardHeader className="bg-church-blue-light/10 pb-4">
              <CardTitle className="text-church-blue-dark text-2xl flex justify-between items-center">
                <span>Your Donation</span>
                <LoginPrompt show={showLoginPrompt} onToggle={toggleLoginPrompt} />
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-6">
              {showThankYou ? (
                <ThankYouMessage onNewDonation={handleNewDonation} />
              ) : (
                <DonationForm onSubmit={handleSubmit} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Give;
