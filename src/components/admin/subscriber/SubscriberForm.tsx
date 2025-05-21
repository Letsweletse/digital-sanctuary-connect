
import React, { useState } from 'react';
import { Subscriber, SubscriberSchema } from '@/types/subscriberTypes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subscriberGroups } from '@/data/subscribersData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import FormActions from '@/components/media/form-fields/FormActions';

interface SubscriberFormProps {
  subscriber?: Subscriber;
  onSubmit: (subscriber: Omit<Subscriber, 'id'>) => boolean;
  onCancel: () => void;
  isEditing: boolean;
}

const SubscriberForm = ({ subscriber, onSubmit, onCancel, isEditing }: SubscriberFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Setup react-hook-form with zod validation
  const form = useForm({
    resolver: zodResolver(SubscriberSchema),
    defaultValues: {
      email: subscriber?.email || '',
      firstName: subscriber?.firstName || '',
      lastName: subscriber?.lastName || '',
      source: subscriber?.source || 'Admin Entry',
      subscribeDate: subscriber?.subscribeDate 
        ? subscriber.subscribeDate instanceof Date 
          ? subscriber.subscribeDate.toISOString().split('T')[0]
          : new Date(subscriber.subscribeDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      unsubscribed: subscriber?.unsubscribed || false,
      groups: subscriber?.groups || [],
    }
  });
  
  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const success = onSubmit({
        ...values,
        subscribeDate: new Date(values.subscribeDate),
      });
      
      if (!success) {
        toast({
          title: "Error",
          description: "Failed to save subscriber. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save subscriber.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="glass-panel bg-white p-6 rounded-xl shadow-md max-w-3xl mx-auto">
      <h3 className="text-xl font-bold text-church-neutral-900 mb-6">
        {isEditing ? 'Edit Subscriber' : 'Add New Subscriber'}
      </h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Input placeholder="How they subscribed" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="subscribeDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subscribe Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="border border-church-neutral-200 p-4 rounded-md">
            <h4 className="font-medium text-church-neutral-700 mb-4">Groups</h4>
            <div className="grid grid-cols-2 gap-4">
              {subscriberGroups.map((group) => (
                <FormField
                  key={group}
                  control={form.control}
                  name="groups"
                  render={({ field }) => {
                    return (
                      <FormItem key={group} className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(group)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, group])
                                : field.onChange(
                                    field.value?.filter(
                                      (value: string) => value !== group
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">{group}</FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="unsubscribed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">Unsubscribed</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormActions
            onCancel={onCancel}
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            disableSubmit={isSubmitting || !form.formState.isValid}
          />
        </form>
      </Form>
    </div>
  );
};

export default SubscriberForm;
