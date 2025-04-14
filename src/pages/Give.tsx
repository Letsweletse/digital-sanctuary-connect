import React from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from 'lucide-react';

const Give = () => {
  const ministries = [
    {
      id: "pastors-travel",
      name: "Pastoral Missions",
      description: "Support our pastors as they travel to unreached communities spreading the Word of God across Botswana and beyond. Your contribution helps cover transportation, accommodation, and resources needed for effective ministry.",
      target: 50000,
      raised: 32500,
      qrCode: "/images/qr-pastors-travel.png"
    },
    {
      id: "new-building",
      name: "New Church Building",
      description: "Help us establish a permanent home for our growing congregation. The new building will include a larger sanctuary, classrooms for children's ministry, and community spaces to better serve our members and visitors.",
      target: 750000,
      raised: 325000,
      qrCode: "/images/qr-building.png"
    },
    {
      id: "family-support",
      name: "Family Support Fund",
      description: "Provide assistance to families in our community facing financial hardship. Your giving helps with essential needs like food, housing, medical expenses, and education for children.",
      target: 100000,
      raised: 67500,
      qrCode: "/images/qr-family.png"
    },
    {
      id: "youth-ministry",
      name: "Youth Ministry",
      description: "Invest in the next generation through our youth programs, camps, and leadership development. We aim to equip young people with strong faith foundations and life skills in a supportive Christian environment.",
      target: 85000,
      raised: 42500,
      qrCode: "/images/qr-youth.png"
    },
    {
      id: "community-outreach",
      name: "Community Outreach",
      description: "Fund our initiatives that serve the broader Gaborone community through food distribution programs, health clinics, educational support, and other practical demonstrations of God's love.",
      target: 120000,
      raised: 78000,
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Support Our Ministry</h1>
            <p className="text-church-neutral-600 text-lg max-w-2xl mx-auto">
              Your generosity enables us to continue spreading the Gospel and serving our community. 
              Choose from the ministries below to direct your giving where your heart leads.
            </p>
          </div>

          <Tabs defaultValue={ministries[0].id} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
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
                        <Button className="btn-primary">Donate Online</Button>
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

          <div className="mt-12 p-6 bg-church-blue-light rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-church-blue-dark">Other Ways to Give</h2>
            <div>
              <h3 className="font-medium mb-2">Bank Transfer Details</h3>
              <p className="text-church-neutral-700 mb-1">Bank: First National Bank Botswana</p>
              <p className="text-church-neutral-700 mb-1">Account Name: Gate Gaborone</p>
              <p className="text-church-neutral-700 mb-1">Account Number: 62767853213</p>
              <p className="text-church-neutral-700 mb-1">Branch Name: FNB Kgale</p>
              <p className="text-church-neutral-700 mb-4">Branch Code: 284567</p>
              <p className="text-church-neutral-700">Please include your name and purpose of giving in the reference.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Give;
