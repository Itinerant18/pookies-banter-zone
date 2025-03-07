
import React from 'react';
import { format } from 'date-fns';

interface DateHeaderProps {
  dateStr: string;
}

const DateHeader: React.FC<DateHeaderProps> = ({ dateStr }) => {
  if (dateStr === 'pending') return null;
  
  const dateObj = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  let displayDate;
  if (dateStr === format(today, 'yyyy-MM-dd')) {
    displayDate = 'Today';
  } else if (dateStr === format(yesterday, 'yyyy-MM-dd')) {
    displayDate = 'Yesterday';
  } else {
    displayDate = format(dateObj, 'MMMM d, yyyy');
  }
  
  return (
    <div className="flex justify-center my-4">
      <div className="bg-muted px-3 py-1 rounded-full text-xs font-medium text-muted-foreground">
        {displayDate}
      </div>
    </div>
  );
};

export default DateHeader;
