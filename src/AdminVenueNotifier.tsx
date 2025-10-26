// Create: /src/components/AdminVenueNotifier.tsx
'use client';

import { useState } from 'react';

export const AdminVenueNotifier = () => {
  const [newVenue, setNewVenue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSendNotifications = async () => {
    if (!newVenue.trim()) {
      alert('Please enter the new venue address');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/admin/notify-venue-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newVenue,
          // Add any admin authentication you need
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Failed to send notifications' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>Venue Change Notification Tool</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          New Venue Address:
        </label>
        <textarea
          value={newVenue}
          onChange={(e) => setNewVenue(e.target.value)}
          placeholder="Enter the complete new venue address..."
          style={{ 
            width: '100%', 
            padding: '10px',
            minHeight: '80px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>

      <button
        onClick={handleSendNotifications}
        disabled={isSending}
        style={{
          padding: '10px 20px',
          background: isSending ? '#ccc' : '#007acc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isSending ? 'not-allowed' : 'pointer'
        }}
      >
        {isSending ? 'Sending Notifications...' : 'Send Venue Change Notifications to All Registrants'}
      </button>

      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          background: result.error ? '#f8d7da' : '#d1ecf1',
          border: `1px solid ${result.error ? '#f5c6cb' : '#bee5eb'}`,
          borderRadius: '4px'
        }}>
          {result.error ? (
            <p style={{ color: '#721c24', margin: 0 }}>Error: {result.error}</p>
          ) : (
            <div>
              <h4>Notification Results:</h4>
              <p>Total Registrants: {result.total}</p>
              <p>Successfully Notified: {result.successful}</p>
              <p>Failed: {result.failed}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
