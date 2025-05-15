
import React from 'react';
import { CreditCard, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import EventQRCode from '@/components/events/EventQRCode';

export type DonationFormValues = {
  givingType: string;
  amount: string;
  firstName: string;
  lastName: string;
  email: string;
}

type DonationFormProps = {
  onSubmit: (data: DonationFormValues) => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ onSubmit }) => {
  const form = useForm<DonationFormValues>({
    defaultValues: {
      givingType: "tithes",
      amount: "",
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          {/* Giving Type */}
          <FormField
            control={form.control}
            name="givingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giving options</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select giving type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="tithes">Tithes</SelectItem>
                    <SelectItem value="offerings">Offerings</SelectItem>
                    <SelectItem value="first-fruits">First Fruits</SelectItem>
                    <SelectItem value="general-donation">General Donation</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter donation amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-church-neutral-500">
                      P
                    </div>
                    <Input
                      {...field}
                      placeholder="0.00"
                      type="number"
                      min="1"
                      className="pl-8"
                      required
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="border-t border-gray-200 pt-5 mt-5">
            <h3 className="font-medium text-lg mb-4">Details</h3>
            
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>First name *</FormLabel>
                  <FormControl>
                    <Input {...field} required placeholder="First name" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Last name *</FormLabel>
                  <FormControl>
                    <Input {...field} required placeholder="Last name" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" required placeholder="email@example.com" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mt-8">
          <Button 
            type="submit" 
            className="w-full md:w-2/3 bg-church-gold hover:bg-church-gold-dark text-church-neutral-800 flex items-center justify-center gap-2 py-6 text-base font-medium"
          >
            <CreditCard className="h-5 w-5" />
            <span>Donate</span>
          </Button>
          
          <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-lg border w-full md:w-1/3">
            <div className="bg-white p-2 rounded-lg flex items-center justify-center w-32 h-32">
              <EventQRCode value="https://example.com/donate-qr" size={112} title="QR Payment" />
            </div>
            <span className="text-sm text-center text-church-neutral-600">Scan to give via mobile</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center text-xs text-church-neutral-500 gap-1 pt-2">
          <Info size={14} />
          <span>All transactions are secure and encrypted</span>
        </div>
      </form>
    </Form>
  );
};

export default DonationForm;
