
import React from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2, User, Calendar, Mail, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Subscriber } from '@/types/subscriberTypes';

interface SubscriberListProps {
  subscribers: Subscriber[];
  isLoading: boolean;
  onEdit: (subscriber: Subscriber) => void;
  onDelete: (id: string) => void;
}

const SubscriberList = ({ subscribers, isLoading, onEdit, onDelete }: SubscriberListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-church-blue mx-auto"></div>
        <p className="mt-4 text-church-neutral-600">Loading subscribers...</p>
      </div>
    );
  }

  if (subscribers.length === 0) {
    return (
      <div className="text-center py-12 bg-church-neutral-50 rounded-lg">
        <Mail className="w-12 h-12 text-church-neutral-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-church-neutral-700">No subscribers</h4>
        <p className="text-church-neutral-500">Add your first subscriber to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-church-neutral-100">
            <th className="p-3 text-left text-church-neutral-700 font-medium">Email</th>
            <th className="p-3 text-left text-church-neutral-700 font-medium">Name</th>
            <th className="p-3 text-left text-church-neutral-700 font-medium">Source</th>
            <th className="p-3 text-left text-church-neutral-700 font-medium">Subscribe Date</th>
            <th className="p-3 text-left text-church-neutral-700 font-medium">Groups</th>
            <th className="p-3 text-left text-church-neutral-700 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((subscriber) => (
            <tr key={subscriber.id} className="border-b border-church-neutral-200 hover:bg-church-neutral-50">
              <td className="p-3">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-church-neutral-400" />
                  <span className="text-church-neutral-900">{subscriber.email}</span>
                </div>
              </td>
              <td className="p-3">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-church-neutral-400" />
                  <span className="text-church-neutral-800">
                    {subscriber.firstName && subscriber.lastName 
                      ? `${subscriber.firstName} ${subscriber.lastName}`
                      : subscriber.firstName || subscriber.lastName || "—"}
                  </span>
                </div>
              </td>
              <td className="p-3">
                <span className="text-church-neutral-700">{subscriber.source}</span>
              </td>
              <td className="p-3">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-church-neutral-400" />
                  <span className="text-church-neutral-700">
                    {subscriber.subscribeDate instanceof Date
                      ? format(subscriber.subscribeDate, 'PP')
                      : format(new Date(subscriber.subscribeDate), 'PP')}
                  </span>
                </div>
              </td>
              <td className="p-3">
                <div className="flex flex-wrap gap-1">
                  {subscriber.groups && subscriber.groups.length > 0 ? (
                    subscriber.groups.map((group, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {group}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-church-neutral-500">—</span>
                  )}
                </div>
              </td>
              <td className="p-3">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(subscriber)}
                    className="text-church-neutral-700 hover:text-church-blue"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(subscriber.id)}
                    className="text-church-neutral-700 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriberList;
