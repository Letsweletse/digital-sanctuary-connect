
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, CreditCard, Check, Info } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import EventQRCode from '@/components/events/EventQRCode';

type FormValues = {
  givingType: string;
  amount: string;
  firstName: string;
  lastName: string;
  email: string;
}

const Give = () => {
  const { toast } = useToast();
  const [showThankYou, setShowThankYou] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      givingType: "tithes",
      amount: "",
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
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
      form.reset();
    }, 3000);
  });

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
                <Button 
                  variant="ghost" 
                  className="text-sm text-church-blue"
                  onClick={() => setShowLoginPrompt(!showLoginPrompt)}
                >
                  Registered before? Log in
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-6">
              {showLoginPrompt && (
                <div className="mb-6 p-4 bg-church-blue-light/10 rounded-md text-sm">
                  Log in to use your saved payment details.
                  <Button variant="link" className="text-church-blue p-0 h-auto text-sm">
                    Login now
                  </Button>
                </div>
              )}

              {showThankYou ? (
                <div className="text-center py-12 space-y-4">
                  <div className="h-16 w-16 bg-church-gold/20 rounded-full flex items-center justify-center mx-auto">
                    <Check className="h-8 w-8 text-church-gold-dark" />
                  </div>
                  <h3 className="text-2xl font-semibold text-church-blue-dark">Thank You For Your Gift!</h3>
                  <p className="text-church-neutral-600">
                    Your generous contribution will help us continue God's work in our community.
                    A receipt has been sent to your email.
                  </p>
                  <Button 
                    onClick={() => setShowThankYou(false)}
                    className="mt-4 bg-church-blue text-white"
                  >
                    Make Another Donation
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-5">
                      {/* Giving Type */}
                      <FormField
                        control={form.control}
                        name="givingType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Giving options</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select giving type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="tithes">Tithes</SelectItem>
                                <SelectItem value="offerings">Offerings</SelectItem>
                                <SelectItem value="first-fruits">First Fruits</SelectItem>
                                <SelectItem value="general-donation">General Donation</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      {/* Amount */}
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Enter donation amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-church-neutral-500">
                                  P
                                </div>
                                <Input
                                  {...field}
                                  placeholder="0.00"
                                  type="number"
                                  min="1"
                                  className="pl-8"
                                  required
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="border-t border-gray-200 pt-5 mt-5">
                        <h3 className="font-medium text-lg mb-4">Details</h3>
                        
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem className="mb-4">
                              <FormLabel>First name *</FormLabel>
                              <FormControl>
                                <Input {...field} required placeholder="First name" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem className="mb-4">
                              <FormLabel>Last name *</FormLabel>
                              <FormControl>
                                <Input {...field} required placeholder="Last name" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" required placeholder="email@example.com" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between mt-8">
                      <Button 
                        type="submit" 
                        className="w-full md:w-2/3 bg-church-gold hover:bg-church-gold-dark text-church-neutral-800 flex items-center justify-center gap-2 py-6 text-base font-medium"
                      >
                        <CreditCard className="h-5 w-5" />
                        <span>Donate</span>
                      </Button>
                      
                      <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-lg border w-full md:w-1/3">
                        <div className="bg-white p-2 rounded-lg flex items-center justify-center w-32 h-32">
                          <EventQRCode value="https://example.com/donate-qr" size={112} title="QR Payment" />
                        </div>
                        <span className="text-sm text-center text-church-neutral-600">Scan to give via mobile</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center text-xs text-church-neutral-500 gap-1 pt-2">
                      <Info size={14} />
                      <span>All transactions are secure and encrypted</span>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Give;
