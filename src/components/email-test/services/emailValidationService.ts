
/**
 * Validate email data before sending
 * This helps identify issues that might cause 400 errors from Resend
 */
export const validateEmailData = (data: any) => {
  // Check if recipients are valid emails
  if (data.to) {
    if (Array.isArray(data.to)) {
      const invalidEmails = data.to.filter((email: string) => 
        !email.includes('@') || email.trim() === '' || email.length > 254
      );
      if (invalidEmails.length > 0) {
        return {
          valid: false,
          error: `Invalid email format in recipients: ${invalidEmails.join(', ')}`
        };
      }
    } else if (typeof data.to === 'string') {
      if (!data.to.includes('@') || data.to.trim() === '' || data.to.length > 254) {
        return {
          valid: false,
          error: `Invalid email format in recipient: ${data.to}`
        };
      }
    }
  } else {
    return {
      valid: false,
      error: 'Missing recipient email addresses'
    };
  }

  // Validate required fields
  if (!data.name || data.name.trim() === '') {
    return {
      valid: false,
      error: 'Name is required and cannot be empty'
    };
  }

  if (!data.email || !data.email.includes('@') || data.email.trim() === '') {
    return {
      valid: false,
      error: 'Valid email is required for the sender'
    };
  }

  // Validate email subject
  if (!data.subject || data.subject.trim() === '') {
    return {
      valid: false,
      error: 'Email subject is required'
    };
  }

  return { valid: true };
};

/**
 * Prepare email data for sending
 * This transforms and validates the request data
 */
export const prepareEmailData = (formData: any) => {
  // Clone to avoid modifying the original
  let requestBody = { ...formData };
  
  // If formData contains a 'to' property as a string, convert it to an array
  if (typeof requestBody.to === 'string') {
    // Prepare the email recipients array
    const toEmails = requestBody.to.split(',').map((email: string) => email.trim());
    
    // Validate recipient emails
    const invalidEmails = toEmails.filter((email: string) => !email.includes('@') || email.trim() === '');
    if (invalidEmails.length > 0) {
      throw new Error(`Invalid email address(es): ${invalidEmails.join(', ')}`);
    }
    
    // Update the requestBody with the array of emails
    requestBody.to = toEmails;
  }

  // Add a timestamp to prevent caching issues
  requestBody.timestamp = new Date().getTime();

  return requestBody;
};
