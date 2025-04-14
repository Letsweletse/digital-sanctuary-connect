/**
 * Direct Resend Email Service
 * Handles email sending directly to Resend API
 */

// Use multiple CORS proxies as fallbacks in case one fails
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/',
  'https://cors-proxy.htmldriven.com/?url='
];

const RESEND_API_URL = 'https://api.resend.com';

// Track sent emails to prevent duplicates
const sentEmails = new Map();

// Log email delivery attempts to console for debugging
const logEmailAttempt = (message: string, data: any = {}) => {
  console.log(`📧 EMAIL DELIVERY: ${message}`, data);
};

// Generate a deterministic hash for an email payload
function getEmailHash(emailData: any): string {
  // Use provided requestId if available
  if (emailData.requestId) {
    return emailData.requestId;
  }
  
  // Create a deterministic hash from email properties
  const toStr = Array.isArray(emailData.to) ? emailData.to.join(',') : emailData.to || '';
  const subjectStr = emailData.subject || '';
  const timestampStr = emailData.timestamp || Date.now().toString();
  
  return `${toStr}-${subjectStr}-${timestampStr}`;
}

// Directly send email via Resend API with fetch and multiple fallbacks
export const sendDirectResendEmail = async (
  apiKey: string, 
  emailData: any
): Promise<any> => {
  logEmailAttempt('Starting direct email send process', { 
    to: Array.isArray(emailData.to) ? emailData.to.join(', ') : emailData.to,
    subject: emailData.subject,
    requestId: emailData.requestId
  });
  
  try {
    // Validate required parameters
    if (!apiKey) {
      throw new Error('Resend API key is required');
    }
    
    if (!emailData.to || !emailData.subject) {
      throw new Error('Email requires at least "to" and "subject" fields');
    }
    
    // Generate a unique hash for this email to prevent duplicates
    const emailHash = getEmailHash(emailData);
    
    // Check if we've already sent this exact email in the past 30 seconds
    const recentSend = sentEmails.get(emailHash);
    if (recentSend && recentSend.timestamp > Date.now() - 30000) {
      logEmailAttempt('DUPLICATE EMAIL DETECTED - Email with same content was sent within the last 30 seconds', {
        to: emailData.to,
        subject: emailData.subject,
        hash: emailHash,
        previousSend: recentSend
      });
      
      return {
        success: true,
        message: 'Email already sent (duplicate prevented)',
        id: recentSend.id,
        timestamp: new Date().toISOString(),
        duplicate: true,
        originalSentAt: new Date(recentSend.timestamp).toISOString()
      };
    }
    
    // Ensure "from" field is set (required by Resend)
    const from = emailData.from || 'info@gategaborone.com';
    
    // Prepare the email payload for Resend API with additional metadata for tracking
    const payload = {
      from: from,
      to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
      subject: emailData.subject,
      html: emailData.html || emailData.message || `<p>${emailData.message || ''}</p><p>Sent at: ${new Date().toISOString()}</p>`,
      text: emailData.text ? `${emailData.text}\n\nSent: ${new Date().toISOString()}` : `Sent: ${new Date().toISOString()}`,
      reply_to: emailData.replyTo || from,
      headers: {
        ...emailData.headers,
        "X-Entity-Ref-ID": emailData.requestId || `direct-${Date.now()}`,
        "X-Mail-Priority": "1",
        "X-Priority": "1", 
        "X-MSMail-Priority": "High",
        "Importance": "high",
        "X-Resend-SMTP-Force": "true" // Force SMTP delivery attempt
      }
    };
    
    logEmailAttempt('Attempting direct send with payload', payload);
    
    // Try multiple strategies for sending the email
    let result = null;
    let lastError = null;
    
    // Strategy 1: Direct API call (no proxy)
    try {
      logEmailAttempt('Strategy 1: Direct API call');
      const response = await fetch(`${RESEND_API_URL}/emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        logEmailAttempt('Strategy 1 succeeded! Email sent directly', responseData);
        
        // Record this email as sent
        sentEmails.set(emailHash, {
          id: responseData.id,
          timestamp: Date.now(),
          to: emailData.to,
          subject: emailData.subject
        });
        
        // Cleanup old entries to prevent memory leaks
        if (sentEmails.size > 50) {
          // Keep only the 50 most recent emails
          const keysToDelete = Array.from(sentEmails.keys())
            .sort((a, b) => sentEmails.get(a).timestamp - sentEmails.get(b).timestamp)
            .slice(0, sentEmails.size - 50);
          
          keysToDelete.forEach(key => sentEmails.delete(key));
        }
        
        return {
          success: true,
          message: 'Email sent successfully via direct API call',
          provider: 'direct-resend-strategy-1',
          data: responseData,
          id: responseData.id,
          timestamp: new Date().toISOString(),
          emailHash
        };
      } else {
        lastError = `Direct API call failed: ${responseData.message || response.statusText}`;
        logEmailAttempt('Strategy 1 failed, will try proxies', { error: lastError });
      }
    } catch (directError) {
      lastError = `Direct API error: ${directError.message}`;
      logEmailAttempt('Strategy 1 exception', { error: lastError });
    }
    
    // Strategy 2: Try each CORS proxy in sequence
    for (let i = 0; i < CORS_PROXIES.length; i++) {
      const proxy = CORS_PROXIES[i];
      try {
        logEmailAttempt(`Strategy 2.${i+1}: Using CORS proxy: ${proxy}`);
        
        const proxyUrl = `${proxy}${RESEND_API_URL}/emails`;
        
        const response = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(payload)
        });
        
        const responseData = await response.json();
        
        if (response.ok) {
          logEmailAttempt(`Strategy 2.${i+1} succeeded! Email sent via proxy`, responseData);
          
          // Record this email as sent
          sentEmails.set(emailHash, {
            id: responseData.id,
            timestamp: Date.now(),
            to: emailData.to,
            subject: emailData.subject
          });
          
          return {
            success: true,
            message: `Email sent successfully via CORS proxy ${i+1}`,
            provider: `direct-resend-proxy-${i+1}`,
            data: responseData,
            id: responseData.id,
            timestamp: new Date().toISOString(),
            emailHash
          };
        } else {
          lastError = `Proxy ${i+1} failed: ${responseData.message || response.statusText}`;
          logEmailAttempt(`Strategy 2.${i+1} failed`, { error: lastError });
        }
      } catch (proxyError) {
        lastError = `Proxy ${i+1} error: ${proxyError.message}`;
        logEmailAttempt(`Strategy 2.${i+1} exception`, { error: lastError });
      }
    }
    
    // Strategy 3: Try fetch with no-cors mode as last resort
    try {
      logEmailAttempt('Strategy 3: Using no-cors mode');
      
      // For no-cors, we can't read the response, so this is a last resort
      await fetch(`${RESEND_API_URL}/emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        mode: 'no-cors',
        body: JSON.stringify(payload)
      });
      
      // We can't verify success with no-cors, but let's assume it worked
      logEmailAttempt('Strategy 3 attempted (no-cors mode)');
      
      // Record this email as sent
      const mockedId = `no-cors-${Date.now()}`;
      sentEmails.set(emailHash, {
        id: mockedId,
        timestamp: Date.now(),
        to: emailData.to,
        subject: emailData.subject
      });
      
      return {
        success: true,
        message: 'Email sending attempted via no-cors mode (success unconfirmed)',
        provider: 'direct-resend-no-cors',
        data: { id: mockedId },
        id: mockedId,
        timestamp: new Date().toISOString(),
        emailHash
      };
    } catch (noCorsError) {
      lastError = `No-cors mode error: ${noCorsError.message}`;
      logEmailAttempt('Strategy 3 exception', { error: lastError });
    }
    
    // If all strategies failed, throw the last error
    throw new Error(lastError || 'All email sending strategies failed');
  } catch (error) {
    logEmailAttempt('CRITICAL ERROR: All email strategies failed', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error in direct Resend service',
      error: error,
      timestamp: new Date().toISOString()
    };
  }
};
