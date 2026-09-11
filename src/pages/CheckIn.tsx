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
  
  const eventTitle = "Couples Picnic";
  const eventDate = "Saturday, 19 September 2026";
  const eventVenue = "Ditlhareng Estate, Gabane (Taylor's Place)";
  const directions = `Take the tar road from Mogoditshane to Kumakwane. Pass Gabane traffic lights; keep going towards Kumakwane. The last left turn into Gabane is about 3km further next to the hill on the left. Turn left there and go about 200m till you see the sign on the right that says Ditlhareng. When you get to the gate press 2580# on the key pad to enter. Proceed up the road and turn left at the 'Stables' sign. Keep going straight, ignoring left and right turns. The road will take you to the top of the hill at a house where we'll meet.`;
  const enquiryLine = "For enquiries: tms@btcmail.co.bw or call 72171066 / 72374568";
  
  const shareText = `I'm attending ${eventTitle} at ${eventVenue} on 19 September 2026! Join too 🙌 Reach • Resource • Reform`;
  const shareUrl = window.location.href;
  const registrationUrl = "https://www.gategaborone.co.bw/events?register=couples-picnic-2026";

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
            {checkedIn ? 'Check-in Successful!' : 'Event Check-in'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {checkedIn 
              ? `You have been successfully checked in to ${eventTitle}. We look forward to seeing you!` 
              : 'Please wait while we process your event check-in...'}
          </p>
        </div>
        
        <Card className="shadow-lg border-none rounded-xl overflow-hidden mb-8">
          <CardContent className="p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-primary">{eventTitle}</h2>
                <p className="text-sm text-muted-foreground italic">Reach • Resource • Reform</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{eventDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="text-sm">
                      <div>Arrival: 09:30</div>
                      <div>Start: 10:00</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>{eventVenue}</span>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">Directions to Ditlhareng Estate:</span><br />
                  {directions}
                </div>

                <div className="pt-2">
                  <p className="text-muted-foreground mb-4">
                    Your check-in ID: <span className="font-semibold">{id}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Please show this page to the registration team when you arrive at the event.
                  </p>
                  <p className="text-muted-foreground mt-2 font-medium">
                    {enquiryLine}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                <QRCodeSVG 
                  value={JSON.stringify({
                    checkInId: id,
                    timestamp: new Date().toISOString(),
                    eventTitle,
                    eventDates: eventDate,
                    venue: eventVenue
                  })}
                  size={200}
                  level="H"
                  includeMargin={true}
                  className="border-4 border-white shadow-md rounded-lg"
                />
                <p className="text-sm text-muted-foreground mt-4">
                  Scan this code at the event entrance
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
              <Link to={`/events?register=couples-picnic-2026`}>
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  Register a Friend
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-foreground mb-4">Event Location</h3>
          <LocationMap />
        </div>
      </div>
    </Layout>
  );
};

export default CheckIn;
