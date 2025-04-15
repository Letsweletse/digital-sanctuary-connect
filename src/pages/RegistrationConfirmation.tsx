
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
  
  // Create QR code value - a JSON string of important registration data
  const qrCodeValue = JSON.stringify({
    eventId: event.id,
    eventName: event.title,
    attendeeName: attendee.name,
    attendeeEmail: attendee.email,
    registrationId: registrationData.submitDate
  });
  
  const handleAddToCalendar = () => {
    // Simple calendar URL for Google Calendar
    const startDate = new Date(event.date);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 3); // Default 3-hour event
    
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/-|:|\.\d+/g, "").slice(0,13)}00Z/${endDate.toISOString().replace(/-|:|\.\d+/g, "").slice(0,13)}00Z&details=${encodeURIComponent(`You registered for this event on ${new Date(registrationData.submitDate).toLocaleDateString()}`)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalUrl, '_blank');
  };
  
  const handleShareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: `I'm attending ${event.title}`,
        text: `Join me at ${event.title} on ${formatDate(event.date)} at ${event.time}. Location: ${event.location}`,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support navigator.share
      alert('Share this page URL with your friends to invite them to the event!');
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-16 min-h-screen">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Confirmation Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-church-neutral-800 mb-2">Registration Confirmed!</h1>
            <p className="text-church-neutral-600">
              Thank you for registering for this event. Your details have been received.
            </p>
          </div>
          
          {/* Event Details Card */}
          <Card className="border border-church-blue-light/30 shadow-md overflow-hidden">
            <div className="h-40 relative">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-4 text-white">
                  <h2 className="text-xl md:text-2xl font-bold">{event.title}</h2>
                </div>
              </div>
            </div>
            <CardContent className="p-6 grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-church-blue" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-church-blue" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-church-blue" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4 bg-church-blue-light/10 rounded-md">
                  <p className="text-sm text-church-neutral-600 mb-2">Your Registration QR Code</p>
                  <QRCodeSVG 
                    value={qrCodeValue} 
                    size={150} 
                    level="H" 
                    includeMargin={true}
                    className="rounded-md shadow-sm"
                  />
                  <p className="text-xs text-church-neutral-500 mt-2 text-center">
                    Present this code at the event
                  </p>
                </div>
              </div>
              
              <hr className="my-2 border-church-neutral-200" />
              
              <div className="space-y-2">
                <h3 className="font-semibold text-church-neutral-700">Attendee Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-church-neutral-500">Name</p>
                    <p className="font-medium">{attendee.title} {attendee.name}</p>
                  </div>
                  <div>
                    <p className="text-church-neutral-500">Email</p>
                    <p className="font-medium">{attendee.email}</p>
                  </div>
                  <div>
                    <p className="text-church-neutral-500">Phone</p>
                    <p className="font-medium">{attendee.phone}</p>
                  </div>
                  <div>
                    <p className="text-church-neutral-500">Role</p>
                    <p className="font-medium">{attendee.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAddToCalendar} 
                  className="bg-church-blue hover:bg-church-blue-dark text-white"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Add to Calendar
                </Button>
                <Button 
                  onClick={handleShareEvent} 
                  variant="outline" 
                  className="border-church-blue text-church-blue"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Event
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center mt-8">
            <Button 
              onClick={() => navigate('/events')} 
              variant="ghost" 
              className="text-church-blue hover:text-church-blue-dark"
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
