import Chip from '@/shared/ui/chip/Chip';
import Icon from '@/shared/ui/icon/Icon';

type Participant = {
  id: string;
  name: string;
};

type AttendanceGroupProps = {
  type: 'can' | 'cannot';
  participants: Participant[];
  emptyMessage?: string;
};

const config = {
  can: {
    textColor: 'text-text-primary',
    icon: 'ic_circle_check_filled' as const,
    label: '참석 가능해요',
  },
  cannot: {
    textColor: 'text-red-700',
    icon: 'ic_circle_x_filled' as const,
    label: '아쉽지만 못 가요',
  },
};

export default function AttendanceGroup({
  type,
  participants,
  emptyMessage,
}: AttendanceGroupProps) {
  const { textColor, icon, label } = config[type];

  return (
    <div className='flex flex-col gap-2'>
      <div className={`text-body-5 flex items-center gap-1 ${textColor}`}>
        <Icon name={icon} size={16} />
        <span>{label}</span>
      </div>

      {participants.length > 0 ? (
        <div className='flex flex-wrap gap-1.5'>
          {participants.map((p) => (
            <Chip
              key={p.id}
              text={p.name}
              variant='fill'
              size='sm'
              selectable={false}
            />
          ))}
        </div>
      ) : emptyMessage ? (
        <p className='text-body-5 text-text-tertiary text-center'>
          {emptyMessage}
        </p>
      ) : null}
    </div>
  );
}
