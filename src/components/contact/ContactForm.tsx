
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { sendContactFormEmail } from '@/lib/emailService';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
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
  );
};

export default ContactForm;
