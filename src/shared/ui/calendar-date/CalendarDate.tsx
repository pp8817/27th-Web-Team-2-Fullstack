import { cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/Badge';

export type CalendarDateVariant =
  | 'default'
  | 'holiday'
  | 'other'
  | 'other_holiday'
  | 'secondary'
  | 'secondary_holiday'
  | 'selected'
  | '1st'
  | '2nd'
  | '3rd'
  | 'meeting_selected';

type CalendarDateLabel = {
  id: string;
  title: string;
  isActive?: boolean;
};

type CalendarDateProps = {
  day: number;
  variant: CalendarDateVariant;
  isToday?: boolean;
  rank?: number | null;
  labels?: CalendarDateLabel[];
  onClick?: () => void;
  className?: string;
};

const calendarDateVariants = cva(
  'flex items-center justify-center text-body-4',
  {
    variants: {
      variant: {
        default: 'bg-transparent text-text-secondary rounded-[4px]',
        holiday: 'bg-transparent text-red-700 rounded-[4px]',
        other: 'bg-transparent text-gray-200 rounded-[4px]',
        other_holiday: 'bg-transparent text-red-100 rounded-[4px]',
        secondary: 'bg-gray-100 text-text-secondary rounded-[8px]',
        secondary_holiday: 'bg-gray-100 text-red-700 rounded-[8px]',
        selected: 'bg-gray-800 text-text-inverse rounded-[8px]',
        meeting_selected: 'text-text-secondary',
        '1st': 'bg-primary-subtler text-text-inverse rounded-[8px]',
        '2nd': 'bg-gray-500 text-text-inverse rounded-[8px]',
        '3rd': 'bg-gray-500 text-text-inverse rounded-[8px]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export default function CalendarDate({
  day,
  variant,
  isToday = false,
  rank,
  labels,
  onClick,
  className,
}: CalendarDateProps) {
  const isMeetingSelected = variant === 'meeting_selected';
  const showBadge =
    rank !== undefined &&
    rank !== null &&
    rank <= 3 &&
    (variant === '1st' || variant === '2nd' || variant === '3rd');

  const hasLabels = labels && labels.length > 0;

  return (
    <div
      className={cn(
        'relative flex flex-col items-center',
        isMeetingSelected && 'z-10',
        className,
      )}
      onClick={onClick}
    >
      {/* Selected state background – extends through parent's padding to fill the full day cell */}
      {isMeetingSelected && (
        <div className='absolute inset-y-0 left-1/2 z-0 w-[112.5%] -translate-x-1/2 rounded-lg bg-white shadow-[0px_0px_36px_0px_rgba(124,117,118,0.2)]' />
      )}

      <div
        data-part='number'
        className={cn(
          calendarDateVariants({ variant }),
          'size-8.5',
          isMeetingSelected && 'relative z-1',
        )}
      >
        {isToday ? (
          <span className='rounded-[12px] bg-gray-100 px-1.5'>{day}</span>
        ) : (
          day
        )}
        {showBadge && (
          <div className='absolute -top-3 -right-2 z-10'>
            <Badge
              variant={rank === 1 ? 'rank1' : rank === 2 ? 'rank2' : 'rank3'}
              size='sm'
            >
              {rank}위
            </Badge>
          </div>
        )}
      </div>

      {hasLabels && (
        <div
          className={cn(
            'flex w-full flex-col gap-0.5',
            isMeetingSelected && 'z-10',
          )}
        >
          {labels.slice(0, 2).map((label) => (
            <div
              key={label.id}
              className={cn(
                'flex w-full items-center justify-center rounded px-0.5 py-px',
                label.isActive ? 'bg-gray-700' : 'bg-gray-300',
              )}
            >
              <span className='w-full truncate text-center text-[10px] leading-4 tracking-[-0.2px] text-white'>
                {label.title.length > 4
                  ? `${label.title.slice(0, 4)}...`
                  : label.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
