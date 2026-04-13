import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Clock, MapPin, UserCheck, Share, MessageCircle, Facebook, Twitter, Copy, Check } from 'lucide-react';
import LocationMap from '@/components/contact/LocationMap';

const CheckIn = () => {
  const { id } = useParams<{ id: string }>();
  const [checkedIn, setCheckedIn] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const googleMapsUrl = "https://maps.app.goo.gl/tKHAW2wV6sZ2yLy96";
  const eventTitle = "Perspectives On The Apostolic";
  const eventDate = "Saturday, 9 May 2026";
  const eventVenue = "Gate Gaborone, Plot 54014, Gaborone West";
  
  const shareText = `I'm attending ${eventTitle} at Gate Gaborone on 9 May 2026! Speaker: Thamo Naidoo. You should join too! 🙌 Reach • Resource • Reform`;
  const shareUrl = window.location.href;
  const registrationUrl = "https://www.gategaborone.co.bw/events?register=poa-may-2026";

  useEffect(() => {
    console.log(`Check-in page accessed with ID: ${id}`);
    const timer = setTimeout(() => {
      setCheckedIn(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [id]);

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: eventTitle,
        text: shareText,
        url: shareUrl,
      }).catch(err => console.error('Error sharing:', err));
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappText = `${shareText}\n\nRegister here: ${registrationUrl}\n\nCheck-in: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(whatsappText)}`, '_blank');
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {checkedIn ? (
              <CheckCircle className="h-10 w-10 text-green-600" />
            ) : (
              <UserCheck className="h-10 w-10 text-primary" />
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {checkedIn ? 'Check-in Successful!' : 'Conference Check-in'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {checkedIn 
              ? `You have been successfully checked in to ${eventTitle}. We look forward to seeing you!` 
              : 'Please wait while we process your conference check-in...'}
          </p>
        </div>
        
        <Card className="shadow-lg border-none rounded-xl overflow-hidden mb-8">
          <CardContent className="p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-primary">{eventTitle}</h2>
                <p className="text-sm text-muted-foreground italic">with Thamo Naidoo — Presiding Apostolic Elder, Gate Global Family</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{eventDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="text-sm">
                      <div>Session 1: 09:00–10:15</div>
                      <div>Session 2: 10:45–12:00</div>
                      <div>Session 3: 12:05–13:30</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <a 
                      href={googleMapsUrl}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:underline"
                    >
                      {eventVenue}
                    </a>
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-muted-foreground mb-4">
                    Your check-in ID: <span className="font-semibold">{id}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Please show this page to the registration team when you arrive at the conference.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                <QRCodeSVG 
                  value={JSON.stringify({
                    checkInId: id,
                    timestamp: new Date().toISOString(),
                    mapsUrl: googleMapsUrl,
                    eventTitle,
                    eventDates: eventDate
                  })}
                  size={200}
                  level="H"
                  includeMargin={true}
                  className="border-4 border-white shadow-md rounded-lg"
                />
                <p className="text-sm text-muted-foreground mt-4">
                  Scan this code at the conference entrance
                </p>
              </div>
            </div>
            
            {/* Social Sharing Section */}
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Share & Invite Friends</h3>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handleWhatsAppShare}
                  className="bg-[#25D366] hover:bg-[#20BD5A] text-white"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
                <Button 
                  onClick={handleFacebookShare}
                  className="bg-[#1877F2] hover:bg-[#1565C0] text-white"
                >
                  <Facebook className="mr-2 h-4 w-4" />
                  Facebook
                </Button>
                <Button 
                  onClick={handleTwitterShare}
                  className="bg-[#1DA1F2] hover:bg-[#1A91DA] text-white"
                >
                  <Twitter className="mr-2 h-4 w-4" />
                  Twitter / X
                </Button>
                {navigator.share && (
                  <Button 
                    onClick={handleNativeShare}
                    variant="outline"
                  >
                    <Share className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                )}
                <Button 
                  onClick={handleCopyLink}
                  variant="outline"
                >
                  {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-4 border-t border-border">
              <Link to="/events">
                <Button variant="outline" className="w-full sm:w-auto">
                  View All Events
                </Button>
              </Link>
              <Link to={`/events?register=poa-may-2026`}>
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  Register a Friend
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-foreground mb-4">Conference Location</h3>
          <LocationMap />
        </div>
      </div>
    </Layout>
  );
};

export default CheckIn;
