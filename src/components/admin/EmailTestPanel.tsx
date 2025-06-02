
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Send, CheckCircle, XCircle } from 'lucide-react';
import { sendEventRegistrationEmail } from '@/lib/emailService';

const EmailTestPanel = () => {
  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<any>(null);
  const { toast } = useToast();

  const handleTestEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    console.log('🧪 [Email Test] Starting email test to:', testEmail);

    try {
      // Create test registration data
      const testData = {
        event: "Test Event - The Apostolic Conference 2025",
        eventDate: "2025-05-24",
        eventTime: "9:00 AM - 3:00 PM",
        eventImage: "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/Malawi%20Conference_1744623783611.jpeg",
        location: "https://www.google.com/maps/place/Gate+Gaborone/@-24.6618569,25.9048205,15z",
        attendee: {
          title: "Mr",
          name: "Test User",
          email: testEmail,
          phone: "+267 123456789",
          role: "Individual",
          denomination: "Test Church",
          numberOfAttendees: 1
        },
        message: "This is a test registration from the admin panel",
        submitDate: new Date().toISOString(),
        registrationType: "Standard",
        churchLogo: "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/general/gate-logo.png"
      };

      console.log('🧪 [Email Test] Test data prepared:', testData);

      // Send test email
      const response = await sendEventRegistrationEmail("Test Registration", testData);
      
      console.log('🧪 [Email Test] Response received:', response);
      setLastTestResult(response);

      if (response.success) {
        toast({
          title: "Test Email Sent!",
          description: `Test emails sent successfully to ${testEmail}`,
        });
      } else {
        throw new Error(response.message || "Unknown error");
      }
    } catch (error) {
      console.error('🧪 [Email Test] Error:', error);
      const errorResult = {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString()
      };
      setLastTestResult(errorResult);
      
      toast({
        title: "Test Email Failed",
        description: errorResult.message,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Service Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="testEmail" className="text-sm font-medium">
            Test Email Address
          </label>
          <div className="flex gap-2">
            <Input
              id="testEmail"
              type="email"
              placeholder="Enter email to test"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleTestEmail}
              disabled={isTesting || !testEmail}
              className="flex items-center gap-2"
            >
              <Send className={`h-4 w-4 ${isTesting ? 'animate-pulse' : ''}`} />
              {isTesting ? 'Sending...' : 'Test'}
            </Button>
          </div>
        </div>

        {lastTestResult && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {lastTestResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium">Last Test Result</span>
              <Badge variant={lastTestResult.success ? 'default' : 'destructive'}>
                {lastTestResult.success ? 'Success' : 'Failed'}
              </Badge>
            </div>
            
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              <p><strong>Message:</strong> {lastTestResult.message}</p>
              <p><strong>Time:</strong> {lastTestResult.timestamp}</p>
              {lastTestResult.data && (
                <p><strong>Check-in ID:</strong> {lastTestResult.data.checkInId}</p>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
          <p><strong>Note:</strong> This will send test emails to both the specified address and admin addresses (otenggate@gmail.com, info@gategaborone.com, iblimenterprise@zohomail.com)</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailTestPanel;
