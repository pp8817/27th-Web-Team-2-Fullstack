import { cn } from '@/shared/lib/utils';
import Chip from '@/shared/ui/chip/Chip';
import Icon from '@/shared/ui/icon/Icon';

interface MeetingDateConfirmationCardProps {
  date: string;
  rank: number;
  isSelected?: boolean;
  attendeeCount: number;
  attendees: string[];
  isConfirmed?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function MeetingDateConfirmationCard({
  date,
  rank,
  isSelected = false,
  attendeeCount,
  attendees,
  isConfirmed = false,
  className,
  onClick,
}: MeetingDateConfirmationCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex w-full cursor-pointer flex-col items-start overflow-hidden rounded-[12px] border-2 bg-white p-4 shadow-[0px_0px_30px_0px_rgba(0,0,0,0.04)] transition-all',
        isSelected ? 'border-primary-subtler' : 'border-transparent',
        className,
      )}
    >
      {/* Header Section */}
      <div className='flex w-full items-center justify-between'>
        <div className='flex items-center gap-[10px]'>
          <Chip
            text={`${rank}위`}
            variant='fill'
            size='sm'
            className='cursor-default bg-gray-700 text-white hover:bg-gray-700 hover:text-white'
            selected
            selectable={false}
          />
          <span className='text-title-6 text-gray-900'>{date}</span>
        </div>

        {/* Confirmed Badge */}
        <div
          className={cn(
            'flex items-center gap-0.5 rounded-[6px] py-1 pr-2 pl-1',
            isSelected
              ? 'bg-primary-default text-white'
              : 'text-text-quaternary bg-gray-50',
          )}
        >
          <Icon
            name='ic_check'
            size={16}
            className={cn(isSelected ? 'text-white' : 'text-gray-200')}
          />
          <span className='text-body-4 font-medium'>확정</span>
        </div>
      </div>

      {/* Divider */}
      <div className='my-[12px] w-full border-t border-dashed border-gray-200' />

      {/* Body Section */}
      <div className='flex w-full flex-col gap-2'>
        <div className='flex items-center'>
          <span className='text-title-6 text-primary-300'>{attendeeCount}</span>
          <span className='text-title-6 text-gray-900'>명이 참석 가능해요</span>
        </div>

        <div className='flex flex-wrap gap-[6px]'>
          {attendees.map((attendee, index) => (
            <Chip
              key={`${attendee}-${index}`}
              text={attendee}
              variant='fill'
              size='sm'
              className='text-text-primary hover:text-text-primary cursor-default bg-gray-100 hover:bg-gray-100'
              selectable={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
