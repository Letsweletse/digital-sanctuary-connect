
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Clock, MapPin, UserCheck, Share } from 'lucide-react';
import LocationMap from '@/components/contact/LocationMap';

const CheckIn = () => {
  const { id } = useParams<{ id: string }>();
  const [checkedIn, setCheckedIn] = useState(false);
  
  // Direct Google Maps URL for Gate Gaborone - no shortened URL
  const googleMapsUrl = "https://www.google.com/maps/place/Gate+Gaborone/@-24.6618567,25.9048083,15z/data=!4m6!3m5!1s0x1ebb5b26225a6213:0xaed9e468c1e4ef31!8m2!3d-24.6618567!4d25.9048083!16s%2Fg%2F11q89m2yrq";
  
  useEffect(() => {
    // Log page visit for analytics
    console.log(`Check-in page accessed with ID: ${id}`);
    
    // You could add actual check-in logic here in the future
    // For now, we'll simulate a successful check-in
    const timer = setTimeout(() => {
      setCheckedIn(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Gate Gaborone Event Check-in',
        text: 'I\'m attending an event at Gate Gaborone! You should join too.',
        url: window.location.href,
      })
      .catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support navigator.share
      alert('Share this page URL with your friends to invite them to the event!');
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {checkedIn ? (
              <CheckCircle className="h-10 w-10 text-green-600" />
            ) : (
              <UserCheck className="h-10 w-10 text-church-blue" />
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-church-neutral-800 mb-3">
            {checkedIn ? 'Check-in Successful!' : 'Event Check-in'}
          </h1>
          <p className="text-lg text-church-neutral-600 max-w-xl mx-auto">
            {checkedIn 
              ? 'You have been successfully checked in to the event. We look forward to seeing you!' 
              : 'Please wait while we process your check-in...'}
          </p>
        </div>
        
        <Card className="shadow-lg border-none rounded-xl overflow-hidden bg-white mb-8">
          <CardContent className="p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-church-blue-dark">Gate Gaborone Event</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-church-blue flex-shrink-0" />
                    <span>Experience the presence of God with us</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-church-blue flex-shrink-0" />
                    <span>Service times: Sunday 9:00AM - 12:00PM</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-church-blue mt-1 flex-shrink-0" />
                    <a 
                      href={googleMapsUrl}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-church-blue hover:underline"
                    >
                      Gate Gaborone, Plot 26773, Block 9<br />
                      Gaborone, Botswana
                    </a>
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-church-neutral-700 mb-4">
                    Your check-in ID: <span className="font-semibold">{id}</span>
                  </p>
                  <p className="text-church-neutral-700">
                    Please show this page to the ushers when you arrive.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                <QRCodeSVG 
                  value={JSON.stringify({
                    checkInId: id,
                    timestamp: new Date().toISOString(),
                    mapsUrl: googleMapsUrl // Include the map URL in the QR code data
                  })}
                  size={200}
                  level="H"
                  includeMargin={true}
                  className="border-4 border-white shadow-md rounded-lg"
                />
                <p className="text-sm text-church-neutral-600 mt-4">
                  Scan this code at the event entrance
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-100">
              <Button 
                className="bg-church-blue hover:bg-church-blue-dark" onClick={handleShare}>
                <Share className="mr-2 h-4 w-4" />
                Share Check-in
              </Button>
              <Link to="/events">
                <Button variant="outline" className="w-full sm:w-auto">
                  View All Events
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-church-neutral-800 mb-4">Event Location</h3>
          <LocationMap />
        </div>
      </div>
    </Layout>
  );
};

export default CheckIn;
