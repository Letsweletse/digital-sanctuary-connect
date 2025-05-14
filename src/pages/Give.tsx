
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, CreditCard, RefreshCw, Check, Info, Heart, Book, ChevronRight } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

type FormValues = {
  givingType: string;
  amount: string;
  name: string;
  email: string;
  message?: string;
  recurringOption: "one-time" | "weekly" | "monthly";
  savePaymentInfo: boolean;
}

const Give = () => {
  const { toast } = useToast();
  const [showThankYou, setShowThankYou] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      givingType: "tithes",
      amount: "",
      name: "",
      email: "",
      message: "",
      recurringOption: "one-time",
      savePaymentInfo: false,
    },
  });

  const ministries = [
    {
      id: "pastors-travel",
      name: "Pastoral Missions",
      description: "Support our pastors as they travel to unreached communities spreading the Word of God across Botswana and beyond. Your contribution helps cover transportation, accommodation, and resources needed for effective ministry.",
      target: 50000,
      raised: 0,
      qrCode: "/images/qr-pastors-travel.png"
    },
    {
      id: "new-building",
      name: "New Church Building",
      description: "Help us establish a permanent home for our growing congregation. The new building will include a larger sanctuary, classrooms for children's ministry, and community spaces to better serve our members and visitors.",
      target: 750000,
      raised: 0,
      qrCode: "/images/qr-building.png"
    },
    {
      id: "family-support",
      name: "Family Support Fund",
      description: "Provide assistance to families in our community facing financial hardship. Your giving helps with essential needs like food, housing, medical expenses, and education for children.",
      target: 100000,
      raised: 0,
      qrCode: "/images/qr-family.png"
    },
    {
      id: "community-outreach",
      name: "Community Outreach",
      description: "Fund our initiatives that serve the broader Gaborone community through food distribution programs, health clinics, educational support, and other practical demonstrations of God's love.",
      target: 120000,
      raised: 0,
      qrCode: "/images/qr-outreach.png"
    }
  ];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-BW', { 
      style: 'currency', 
      currency: 'BWP',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateProgress = (raised: number, target: number) => {
    return (raised / target) * 100;
  };

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
      <div className="w-full bg-gradient-to-br from-church-blue/10 to-church-gold/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-church-blue-dark mb-6">Partner With Us</h1>
            <p className="text-xl text-church-neutral-600 mb-4">
              "Give, and it will be given to you. A good measure, pressed down, shaken together and running over, 
              will be poured into your lap. For with the measure you use, it will be measured to you." — Luke 6:38
            </p>
            <div className="w-20 h-1 bg-church-gold mx-auto mb-8"></div>
            <p className="text-lg text-church-neutral-700 mb-8 max-w-2xl mx-auto">
              Your generous support enables us to spread the Gospel, provide community services, and be a beacon of hope in Botswana and beyond.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-soft border border-church-neutral-200/30 text-center transform transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="w-16 h-16 bg-church-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-church-gold-dark" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-church-blue-dark">Support Ministry</h3>
              <p className="text-church-neutral-600 mb-4">Your support helps us reach more people with the Gospel and provide meaningful community services.</p>
              <Button 
                variant="link" 
                className="text-church-blue flex items-center text-sm"
                onClick={() => document.getElementById('giving-form')?.scrollIntoView({behavior: 'smooth'})}
              >
                Give Now <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-soft border border-church-neutral-200/30 text-center transform transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="w-16 h-16 bg-church-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="h-8 w-8 text-church-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-church-blue-dark">Biblical Giving</h3>
              <p className="text-church-neutral-600 mb-4">Giving is an act of worship that acknowledges God as the provider of all our blessings.</p>
              <Button 
                variant="link" 
                className="text-church-blue flex items-center text-sm"
              >
                Learn More <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-soft border border-church-neutral-200/30 text-center transform transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="w-16 h-16 bg-church-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-8 w-8 text-church-gold-dark" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-church-blue-dark">Various Ways</h3>
              <p className="text-church-neutral-600 mb-4">We offer multiple giving options including online, bank transfer, and mobile payments.</p>
              <Button 
                variant="link" 
                className="text-church-blue flex items-center text-sm"
              >
                See Options <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          <div id="giving-form" className="scroll-mt-24">
            <Tabs defaultValue="donation-form" className="w-full mb-8">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="donation-form" className="text-sm py-2">
                  Make a Donation
                </TabsTrigger>
                <TabsTrigger value="specific-causes" className="text-sm py-2">
                  Support Specific Causes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="donation-form" className="mt-4">
                <Card className="border border-church-blue-light/50">
                  <CardHeader className="bg-church-blue-light/20">
                    <CardTitle className="text-church-blue-dark text-2xl">Give to the Lord's Work</CardTitle>
                    <CardDescription className="text-base">
                      Your gift helps us fulfill our mission to bring the Gospel to our community and beyond.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
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
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="givingType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>I'm giving to</FormLabel>
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

                            <FormField
                              control={form.control}
                              name="amount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Amount (BWP)</FormLabel>
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
                            
                            <div className="flex flex-wrap gap-2 justify-between mt-2">
                              {[100, 250, 500, 1000].map((amount) => (
                                <Button
                                  key={amount}
                                  type="button"
                                  variant="outline"
                                  className="flex-1 min-w-[70px] border-church-gold-light hover:bg-church-gold-light hover:text-church-neutral-800"
                                  onClick={() => form.setValue("amount", amount.toString())}
                                >
                                  P{amount}
                                </Button>
                              ))}
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Your Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} required placeholder="Full Name" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="email" required placeholder="email@example.com" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="message"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Prayer Request or Message (Optional)</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      {...field}
                                      placeholder="Share your prayer request or a message..."
                                      className="resize-none"
                                      rows={3}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <div className="space-y-2">
                              <FormLabel>Giving Frequency</FormLabel>
                              <RadioGroup 
                                defaultValue={form.getValues("recurringOption")} 
                                onValueChange={(value: "one-time" | "weekly" | "monthly") => 
                                  form.setValue("recurringOption", value)
                                }
                                className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="one-time" id="one-time" />
                                  <Label htmlFor="one-time">One Time</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="weekly" id="weekly" />
                                  <Label htmlFor="weekly">Weekly</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="monthly" id="monthly" />
                                  <Label htmlFor="monthly">Monthly</Label>
                                </div>
                              </RadioGroup>
                            </div>
                            
                            <div className="flex items-center space-x-2 pt-2">
                              <Checkbox 
                                id="savePaymentInfo" 
                                checked={form.getValues("savePaymentInfo")}
                                onCheckedChange={(checked) => 
                                  form.setValue("savePaymentInfo", checked === true)
                                } 
                              />
                              <label
                                htmlFor="savePaymentInfo"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Save my information for future giving
                              </label>
                            </div>
                          </div>
                          
                          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mt-8">
                            <Button 
                              type="submit" 
                              className="w-full md:w-2/3 bg-church-gold hover:bg-church-gold-dark text-church-neutral-800 flex items-center justify-center gap-2 py-6 text-base font-medium"
                            >
                              <CreditCard className="h-5 w-5" />
                              <span>Give Now</span>
                            </Button>
                            
                            <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-lg border w-full md:w-1/3">
                              <div className="bg-white p-2 rounded-lg flex items-center justify-center w-32 h-32">
                                <QrCode size={112} className="text-church-blue" />
                                <span className="sr-only">QR Code for donations</span>
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
              </TabsContent>

              <TabsContent value="specific-causes" className="mt-4">
                <Tabs defaultValue={ministries[0].id} className="w-full">
                  <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
                    {ministries.map(ministry => (
                      <TabsTrigger key={ministry.id} value={ministry.id} className="text-sm py-2">
                        {ministry.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {ministries.map(ministry => (
                    <TabsContent key={ministry.id} value={ministry.id} className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-church-blue-dark text-2xl">{ministry.name}</CardTitle>
                          <CardDescription className="text-base">{ministry.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{formatAmount(ministry.raised)} of {formatAmount(ministry.target)}</span>
                            </div>
                            <div className="w-full bg-church-neutral-200 rounded-full h-2">
                              <div 
                                className="bg-church-gold h-2 rounded-full" 
                                style={{ width: `${calculateProgress(ministry.raised, ministry.target)}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mt-6">
                            <div className="flex flex-col gap-4 w-full md:w-auto">
                              <Button className="bg-church-blue hover:bg-church-blue-dark text-white">Donate Online</Button>
                              <Button variant="outline" className="flex items-center gap-2">
                                <span>Bank Transfer</span>
                              </Button>
                            </div>
                            <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-lg border">
                              <div className="bg-white p-2 rounded-lg flex items-center justify-center w-32 h-32">
                                <QrCode size={112} className="text-church-blue" />
                                <span className="sr-only">QR Code for {ministry.name} donations</span>
                              </div>
                              <span className="text-sm text-center text-church-neutral-600">Scan to give via mobile</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex flex-col text-sm text-church-neutral-600 border-t pt-4">
                          <p>"Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver." - 2 Corinthians 9:7</p>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-12 p-6 bg-church-blue-light/20 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-church-blue-dark">Why We Give</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-lg mb-2 text-church-blue-dark">Biblical Principles</h3>
                <p className="text-church-neutral-700 mb-4">
                  Giving is an act of worship that acknowledges God as the source of all blessings. The Bible teaches us to give cheerfully, 
                  generously, and sacrificially, knowing that God loves a cheerful giver.
                </p>
                <p className="text-church-neutral-700 mb-4">
                  "Honor the Lord with your wealth and with the firstfruits of all your produce; 
                  then your barns will be filled with plenty, and your vats will be bursting with wine." — Proverbs 3:9-10
                </p>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2 text-church-blue-dark">Other Ways to Give</h3>
                <div>
                  <h4 className="font-medium mb-2">Bank Transfer Details</h4>
                  <p className="text-church-neutral-700 mb-1">Bank: First National Bank Botswana</p>
                  <p className="text-church-neutral-700 mb-1">Account Name: Gate Gaborone</p>
                  <p className="text-church-neutral-700 mb-1">Account Number: 62767853213</p>
                  <p className="text-church-neutral-700 mb-1">Branch Name: FNB Kgale</p>
                  <p className="text-church-neutral-700 mb-1">Branch Code: 284567</p>
                  <p className="text-church-neutral-700 mt-2">Please include your name and purpose of giving in the reference.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Give;
