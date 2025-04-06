
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { sendContactFormEmail } from '@/lib/emailService';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Form submitted:', formData);
      
      // Send email notification
      const emailResult = await sendContactFormEmail(formData);
      console.log('Email result:', emailResult);
      
      if (emailResult.success) {
        toast({
          title: "Message Sent!",
          description: "We've received your message and will get back to you soon.",
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        toast({
          title: "Error",
          description: "There was a problem sending your message. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 page-transition">
        <section className="bg-church-blue-light py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
                Get in Touch
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-church-neutral-900 mb-6">
                Contact Us
              </h1>
              <p className="text-lg text-church-neutral-700">
                Have questions or want to get involved? 
                We'd love to hear from you and help in any way we can.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-church-neutral-900 mb-8">
                  How to Reach Us
                </h2>
                
                <div className="space-y-8">
                  <div className="glass-panel p-6 flex">
                    <div className="mr-4">
                      <div className="w-12 h-12 bg-church-blue rounded-full flex items-center justify-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-6 w-6 text-white" 
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
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-church-neutral-900 mb-2">Our Location</h3>
                      <p className="text-church-neutral-700">Gate Gaborone Auditorium</p>
                      <p className="text-church-neutral-700">Gaborone West, Phase 4, Plot 54014</p>
                    </div>
                  </div>
                  
                  <div className="glass-panel p-6 flex">
                    <div className="mr-4">
                      <div className="w-12 h-12 bg-church-blue rounded-full flex items-center justify-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-6 w-6 text-white" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-church-neutral-900 mb-2">Email Us</h3>
                      <p className="text-church-neutral-700">General Information: otenggate@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="glass-panel p-6 flex">
                    <div className="mr-4">
                      <div className="w-12 h-12 bg-church-blue rounded-full flex items-center justify-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-6 w-6 text-white" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-church-neutral-900 mb-2">Call Us</h3>
                      <p className="text-church-neutral-700">Main Office: +267 3500194</p>
                      <p className="text-church-neutral-700">After Hours: +267 75507981</p>
                    </div>
                  </div>
                  
                  <div className="glass-panel p-6 flex">
                    <div className="mr-4">
                      <div className="w-12 h-12 bg-church-blue rounded-full flex items-center justify-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-6 w-6 text-white" 
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
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-church-neutral-900 mb-2">Service Times</h3>
                      <p className="text-church-neutral-700">Sunday: 8:30 AM & 11:00 AM</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="rounded-xl overflow-hidden shadow-md">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.364152127474!2d25.9048083!3d-24.6618567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ebf843b05f7aa07%3A0x2de14938d5996b9e!2sGaborone%20West%2C%20Phase%204%2C%20Plot%2054014%2C%20Gaborone%2C%20Botswana!5e0!3m2!1sen!2sus!4v1692340450862!5m2!1sen!2sus" 
                      className="w-full h-72" 
                      allowFullScreen 
                      loading="lazy"
                      title="Church Location"
                    ></iframe>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-church-neutral-900 mb-8">
                  Send Us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="glass-panel p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-church-neutral-700 font-medium mb-2">Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-church-neutral-300 focus:outline-none focus:ring-2 focus:ring-church-blue"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-church-neutral-700 font-medium mb-2">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-church-neutral-300 focus:outline-none focus:ring-2 focus:ring-church-blue"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="phone" className="block text-church-neutral-700 font-medium mb-2">Phone (Optional)</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-church-neutral-300 focus:outline-none focus:ring-2 focus:ring-church-blue"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-church-neutral-700 font-medium mb-2">Subject</label>
                      <select 
                        id="subject" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-church-neutral-300 focus:outline-none focus:ring-2 focus:ring-church-blue"
                      >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Volunteering">Volunteering</option>
                        <option value="Event Information">Event Information</option>
                        <option value="Pastoral Care">Pastoral Care</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-church-neutral-700 font-medium mb-2">Message</label>
                    <textarea 
                      id="message" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-church-neutral-300 focus:outline-none focus:ring-2 focus:ring-church-blue resize-none"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn-primary w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
