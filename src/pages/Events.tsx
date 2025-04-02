
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarCheck, User, Mail, Phone } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  image: string;
  registration?: boolean;
}

const Events = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    numberOfAttendees: 1
  });
  
  const events: Event[] = [
    {
      id: '1',
      title: 'Sunday Worship Service',
      date: '2023-12-17',
      time: '9:00 AM & 11:00 AM',
      location: 'Main Sanctuary',
      description: 'Join us for worship, prayer, and Biblical teaching as we gather together as a church family.',
      category: 'worship',
      image: 'https://images.unsplash.com/photo-1508963493744-76fce69379c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    },
    {
      id: '2',
      title: 'Youth Group Night',
      date: '2023-12-15',
      time: '6:30 PM',
      location: 'Youth Center',
      description: 'A fun evening for teenagers with games, worship, and small group discussions about faith and life.',
      category: 'youth',
      image: 'https://images.unsplash.com/photo-1529333166437-7feb29c65e8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80'
    },
    {
      id: '3',
      title: 'Bible Study: Book of Romans',
      date: '2023-12-13',
      time: '7:00 PM',
      location: 'Fellowship Hall',
      description: 'An in-depth study of the Book of Romans led by Pastor John. All are welcome, bring your Bible!',
      category: 'bible-study',
      image: 'https://images.unsplash.com/photo-1612460424642-318229cf9a3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1933&q=80'
    },
    {
      id: '4',
      title: 'Perspectives on the Apostolic',
      date: '2025-05-16',
      time: '9:00 AM - 4:00 PM',
      location: 'Gate Gaborone Auditorium',
      description: 'A special conference exploring apostolic ministry in the modern church. Join us for powerful teachings, workshops, and fellowship.',
      category: 'conference',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80',
      registration: true
    },
    {
      id: '5',
      title: 'Men\'s Breakfast',
      date: '2023-12-09',
      time: '8:00 AM',
      location: 'Fellowship Hall',
      description: 'Monthly gathering for men of all ages. Enjoy breakfast, fellowship, and a short devotional.',
      category: 'fellowship',
      image: 'https://images.unsplash.com/photo-1542641728-6ca359b085f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    },
    {
      id: '6',
      title: 'Christmas Eve Candlelight Service',
      date: '2023-12-24',
      time: '6:00 PM & 8:00 PM',
      location: 'Main Sanctuary',
      description: 'A beautiful tradition of carols, Scripture readings, and candlelight to celebrate the birth of Christ.',
      category: 'worship',
      image: 'https://images.unsplash.com/photo-1512130320987-194af7f7fcbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80'
    },
    {
      id: '7',
      title: 'Women\'s Bible Study',
      date: '2023-12-12',
      time: '9:30 AM',
      location: 'Room 201',
      description: 'Weekly women\'s Bible study focusing on the Psalms. Childcare provided for children under 5.',
      category: 'bible-study',
      image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    },
    {
      id: '8',
      title: 'Children\'s Christmas Program',
      date: '2023-12-17',
      time: '4:00 PM',
      location: 'Main Sanctuary',
      description: 'Our children\'s ministry presents "The First Christmas," a delightful retelling of the nativity story.',
      category: 'children',
      image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    }
  ];
  
  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'worship', name: 'Worship Services' },
    { id: 'bible-study', name: 'Bible Studies' },
    { id: 'fellowship', name: 'Fellowship' },
    { id: 'outreach', name: 'Outreach' },
    { id: 'youth', name: 'Youth' },
    { id: 'children', name: 'Children' },
    { id: 'conference', name: 'Conferences' }
  ];
  
  const filteredEvents = activeCategory === 'all' 
    ? events 
    : events.filter(event => event.category === activeCategory);
  
  // Sort events by date
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleOpenRegistration = (event: Event) => {
    setCurrentEvent(event);
    setIsRegistrationOpen(true);
  };

  const handleCloseRegistration = () => {
    setIsRegistrationOpen(false);
    setCurrentEvent(null);
    // Reset form data
    setFormData({
      name: '',
      email: '',
      phone: '',
      numberOfAttendees: 1
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfAttendees' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the registration data to your backend
    console.log('Registration submitted:', {
      event: currentEvent?.title,
      attendee: formData
    });

    // Show success message
    alert('Registration successful! You will receive a confirmation email shortly.');
    
    // Close the dialog
    handleCloseRegistration();
  };
  
  return (
    <Layout>
      <main className="flex-grow pt-24 page-transition">
        {/* Page Header */}
        <section className="bg-church-blue-light py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
                Events Calendar
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-church-neutral-900 mb-6">
                Upcoming Events
              </h1>
              <p className="text-lg text-church-neutral-700">
                Stay connected with our church community through worship services, 
                Bible studies, fellowship gatherings, and special events.
              </p>
            </div>
          </div>
        </section>
        
        {/* Events Calendar */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Category Filters */}
            <div className="mb-10 overflow-x-auto">
              <div className="flex space-x-2 min-w-max">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      activeCategory === category.id 
                        ? 'bg-church-blue text-church-neutral-800' 
                        : 'bg-church-neutral-100 text-church-neutral-700 hover:bg-church-neutral-200'
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedEvents.map((event) => (
                <div key={event.id} className="glass-panel overflow-hidden group">
                  <div className="relative h-48">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-4">
                      <div 
                        className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
                          event.category === 'worship' ? 'bg-church-blue text-church-neutral-800' :
                          event.category === 'bible-study' ? 'bg-church-gold text-church-neutral-800' :
                          event.category === 'fellowship' ? 'bg-green-100 text-green-800' :
                          event.category === 'outreach' ? 'bg-purple-100 text-purple-800' :
                          event.category === 'youth' ? 'bg-orange-100 text-orange-800' :
                          event.category === 'conference' ? 'bg-blue-100 text-blue-800' :
                          'bg-pink-100 text-pink-800'
                        }`}
                      >
                        {categories.find(c => c.id === event.category)?.name}
                      </div>
                      <h3 className="text-xl font-bold text-white">{event.title}</h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-church-neutral-700 mb-3">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-2 text-church-gold" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>{formatDate(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-church-neutral-700 mb-3">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-2 text-church-gold" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>{event.time}</span>
                    </div>
                    
                    <div className="flex items-center text-church-neutral-700 mb-4">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-2 text-church-gold" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    
                    <p className="text-church-neutral-700 mb-6">{event.description}</p>
                    
                    <div className="flex space-x-3">
                      {event.registration ? (
                        <button 
                          className="btn-primary flex-1"
                          onClick={() => handleOpenRegistration(event)}
                        >
                          Register Now
                        </button>
                      ) : (
                        <button className="btn-primary flex-1">
                          Learn More
                        </button>
                      )}
                      <button className="btn-outline flex-1">
                        Add to Calendar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Google Calendar Integration */}
            <div className="mt-16 glass-panel p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-church-neutral-900 mb-4">
                  View Our Full Calendar
                </h3>
                <p className="text-church-neutral-700 max-w-2xl mx-auto">
                  For a complete view of all church events, check out our interactive Google Calendar. 
                  You can add it to your own calendar app to stay updated.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe 
                    src="https://calendar.google.com/calendar/embed?src=c_4f3888bef9b4fcdf367328fd4589754a7b1113b25c401c3c72be4a6fdc6c3ac1%40group.calendar.google.com&ctz=America%2FNew_York" 
                    className="w-full h-96 rounded border-0"
                    title="Church Calendar"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Dialog */}
        <Dialog open={isRegistrationOpen} onOpenChange={handleCloseRegistration}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Register for {currentEvent?.title}</DialogTitle>
              <DialogDescription>
                Complete the form below to reserve your spot for {formatDate(currentEvent?.date || '')} at {currentEvent?.time}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitRegistration}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Your contact number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="numberOfAttendees" className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4" />
                    Number of Attendees
                  </Label>
                  <Input
                    id="numberOfAttendees"
                    name="numberOfAttendees"
                    type="number"
                    min="1"
                    value={formData.numberOfAttendees}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <DialogFooter className="sm:justify-between">
                <Button type="button" variant="outline" onClick={handleCloseRegistration}>
                  Cancel
                </Button>
                <Button type="submit">Submit Registration</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </Layout>
  );
};

export default Events;
