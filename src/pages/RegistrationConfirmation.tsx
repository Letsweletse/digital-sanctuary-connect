import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Calendar, Clock, MapPin, Ticket, Download, Share2 } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';

const RegistrationConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const registrationData = location.state?.registrationData;
  
  // Redirect to events page if no registration data is found
  useEffect(() => {
    if (!registrationData) {
      navigate('/events');
    }
  }, [registrationData, navigate]);
  
  if (!registrationData) return null;
  
  const { event, attendee } = registrationData;
  
  // Google Maps location for Ditlhareng Estate, Gabane (Taylor's Place)
  const googleMapsUrl = "https://maps.app.goo.gl/SnbzA7PvQm3m9LJX9";
  
  // Create QR code value - a JSON string of important registration data
  const qrCodeValue = JSON.stringify({
    eventId: event.id,
    eventName: event.title,
    attendeeName: attendee.name,
    attendeeEmail: attendee.email,
    registrationId: registrationData.submitDate,
    location: googleMapsUrl,
    eventDates: "Saturday, 24 October 2026"
  });
  
  const handleAddToCalendar = () => {
    // Add to Google Calendar with full event details
    const startDate = new Date("2026-10-24T09:00:00");
    const endDate = new Date("2026-10-24T13:30:00");
    
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/-|:|\.\d+/g, "").slice(0,13)}00Z/${endDate.toISOString().replace(/-|:|\.\d+/g, "").slice(0,13)}00Z&details=${encodeURIComponent(`You registered for this conference on ${new Date(registrationData.submitDate).toLocaleDateString()}. Conference is on Saturday, 24 October 2026 at Gate Gaborone, Plot 54014, Gaborone West.`)}&location=${encodeURIComponent("Gate Gaborone, Plot 54014, Gaborone West")}`;
    
    window.open(googleCalUrl, '_blank');
  };
  
  const handleShareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: `I'm attending ${event.title}`,
        text: `Join me at ${event.title} on Saturday, 24 October 2026 at Gate Gaborone, Plot 54014, Gaborone West. Registration is compulsory!`,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support navigator.share
      alert('Share this page URL with your friends to invite them to the FREE conference!');
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-16 min-h-screen">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Confirmation Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-church-neutral-800 mb-3">Registration Confirmed</h1>
            <p className="text-church-neutral-600 text-lg">
              Thank you for your registration for Perspectives on the Apostolic.
            </p>
          </div>
          
          {/* Event Details Card */}
          <Card className="border-none shadow-xl overflow-hidden bg-white rounded-xl">
            <div className="h-48 relative">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h2 className="text-2xl md:text-3xl font-bold">{event.title}</h2>
                </div>
              </div>
            </div>
            <CardContent className="p-8 grid gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-church-blue" />
                    <span className="text-lg">Saturday, 24 October 2026</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-church-blue" />
                    <span className="text-lg">09:00 - 13:30</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-church-blue" />
                    <a 
                      href={googleMapsUrl}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-lg hover:text-church-blue hover:underline"
                    >
                      Gate Gaborone, Plot 54014, Gaborone West
                    </a>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center p-6 bg-church-blue-light/5 rounded-xl shadow-sm border border-church-blue-light/20">
                  <p className="text-church-neutral-700 font-medium mb-3">Conference Check-In Code</p>
                  <QRCodeSVG 
                    value={qrCodeValue} 
                    size={160} 
                    level="H" 
                    includeMargin={true}
                    className="rounded-md shadow-sm bg-white p-2"
                  />
                  <p className="text-sm text-church-neutral-600 mt-3">
                    Present this code at the conference registration
                  </p>
                </div>
              </div>
              
              <hr className="border-church-neutral-200" />
              
              <div className="space-y-4">
                <h3 className="font-semibold text-xl text-church-neutral-800">Attendee Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-church-neutral-500 mb-1">Name</p>
                    <p className="font-medium text-lg">{attendee.title} {attendee.name}</p>
                  </div>
                  <div>
                    <p className="text-church-neutral-500 mb-1">Email</p>
                    <p className="font-medium">{attendee.email}</p>
                  </div>
                  <div>
                    <p className="text-church-neutral-500 mb-1">Phone</p>
                    <p className="font-medium">{attendee.phone}</p>
                  </div>
                  <div>
                    <p className="text-church-neutral-500 mb-1">Role</p>
                    <p className="font-medium">{attendee.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAddToCalendar} 
                  className="bg-church-blue hover:bg-church-blue-dark text-white py-5 sm:py-3 font-medium"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Add to Calendar
                </Button>
                <Button 
                  onClick={handleShareEvent} 
                  variant="outline" 
                  className="border-church-blue text-church-blue py-5 sm:py-3 font-medium"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share Conference
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center mt-10">
            <Button 
              onClick={() => navigate('/events')} 
              variant="ghost" 
              className="text-church-blue hover:text-church-blue-dark font-medium"
            >
              Back to All Events
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegistrationConfirmation;
