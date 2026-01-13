
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  };
  
  return new Date(dateString).toLocaleDateString('en-GB', options);
};
