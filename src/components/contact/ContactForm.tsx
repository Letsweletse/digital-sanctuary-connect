
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, User, MessageSquare, Send } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { sendContactFormEmail } from '@/lib/emailService';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define form schema with zod - enhanced validation rules
const formSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .refine(val => /^[a-zA-Z\s'-]+$/.test(val), {
      message: "Name should only contain letters, spaces, hyphens, and apostrophes."
    }),
  email: z.string()
    .email({ message: "Please enter a valid email address." })
    .min(5, { message: "Email must be at least 5 characters." })
    .max(100, { message: "Email cannot exceed 100 characters." }),
  phone: z.string()
    .optional()
    .refine(val => !val || /^[0-9+\s()-]{7,20}$/.test(val), {
      message: "Please enter a valid phone number."
    }),
  subject: z.string().min(1, { message: "Please select a subject." }),
  message: z.string()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(2000, { message: "Message cannot exceed 2000 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  
  // Initialize react-hook-form with zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    mode: "onChange", // Real-time validation as user types
  });

  const onSubmit = async (data: FormValues) => {
    try {
      console.log('Form submitted:', data);
      
      // Send email notification
      const emailResult = await sendContactFormEmail(data);
      console.log('Email result:', emailResult);
      
      if (emailResult.success) {
        toast({
          title: "Message Sent!",
          description: "We've received your message and will get back to you soon.",
        });
        
        // Reset form
        form.reset();
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
    }
  };

  // Calculate character count for message field
  const messageLength = form.watch("message")?.length || 0;
  const messageMaxLength = 2000;

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl md:text-3xl font-bold text-church-neutral-900 mb-8">
        Send Us a Message
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="glass-panel p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-church-neutral-700 font-medium">
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Name
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-church-neutral-700 font-medium">
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-church-neutral-700 font-medium">
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-church-neutral-700 font-medium">Subject</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                      <SelectItem value="Volunteering">Volunteering</SelectItem>
                      <SelectItem value="Event Information">Event Information</SelectItem>
                      <SelectItem value="Pastoral Care">Pastoral Care</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-church-neutral-700 font-medium">
                  <span className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Your message" 
                    className="resize-none" 
                    rows={6}
                    {...field} 
                  />
                </FormControl>
                <div className="flex justify-between items-center mt-1">
                  <FormMessage />
                  <span className={`text-xs ${messageLength > messageMaxLength ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {messageLength}/{messageMaxLength}
                  </span>
                </div>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2">Sending...</span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Message
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
