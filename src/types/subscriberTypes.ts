
import { z } from 'zod';

export interface Subscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  source: string;
  subscribeDate: Date | string;
  unsubscribed?: boolean;
  groups?: string[];
  lastContactDate?: Date | string;
}

export const SubscriberSchema = z.object({
  email: z.string().email("Valid email is required"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  source: z.string().default("website"),
  subscribeDate: z.union([z.date(), z.string()]).transform(val => 
    typeof val === 'string' ? new Date(val) : val
  ),
  unsubscribed: z.boolean().default(false),
  groups: z.array(z.string()).optional().default([]),
  lastContactDate: z.union([z.date(), z.string(), z.null()]).optional(),
});
