
/**
 * Get the speaker image URL based on speaker name or fall back to a default
 * 
 * @param speakerName Name of the speaker
 * @param defaultImage Optional default image to use if no specific image is found
 * @returns URL to the speaker's image
 */
export function getSpeakerImage(speakerName: string, defaultImage: string = '/placeholder.svg'): string {
  // Return images based on speaker name
  if (speakerName?.toLowerCase().includes('thamo')) {
    return '/lovable-uploads/957d2ec2-9f2a-456d-a93c-574a4143e97c.png';
  } else if (speakerName?.toLowerCase().includes('kobus')) {
    return '/lovable-uploads/20736aa1-df4f-4d5b-b226-d41cb293bbe0.png';
  } else if (speakerName?.toLowerCase().includes('peter taylor')) {
    return '/lovable-uploads/a90674e8-ab9d-4607-97c5-e9553e6d0075.png';
  } else if (speakerName?.toLowerCase().includes('cynthia')) {
    return '/lovable-uploads/cfcf20f7-6921-4a44-b7ca-47809450d18c.png';
  } else if (speakerName?.toLowerCase().includes('thabiso')) {
    return '/lovable-uploads/e6febe02-1bbb-4eaf-97e1-9ee6e3fa12d4.png';
  } else if (speakerName?.toLowerCase().includes('oteng')) {
    return '/lovable-uploads/bb2cad8b-0655-4b9e-acde-059a018eba68.png';
  }
  
  // Return default image if no match found
  return defaultImage;
}
