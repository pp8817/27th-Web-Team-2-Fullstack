'use client';

import type { Participant } from '@/entities/meeting/dto/meet.dto';
import Icon from '@/shared/ui/icon/Icon';
import NumberStepper from '@/shared/ui/number-stepper/NumberStepper';

interface ParticipantManagerProps {
  participantCount: number | null;
  participants: Participant[];
  onCountChange: (value: number) => void;
  onRemoveParticipant: (participantId: number) => void;
  countError: string;
}

export default function ParticipantManager({
  participantCount,
  participants,
  onCountChange,
  onRemoveParticipant,
  countError,
}: ParticipantManagerProps) {
  return (
    <div className='flex flex-col gap-6'>
      {/* 투표 인원 */}
      <div>
        <div className='flex items-center justify-between py-1'>
          <div className='flex items-start gap-0.5'>
            <span className='text-title-8 text-gray-600'>투표 인원</span>
            <div className='bg-error-default mt-0.75 h-0.75 w-0.75 rounded-full' />
          </div>
          <NumberStepper
            defaultValue={participantCount ?? 1}
            max={999}
            onChange={onCountChange}
          />
        </div>
        {countError && (
          <p className='text-body-5 text-error-default mt-1'>{countError}</p>
        )}
      </div>

      {/* 이미 투표한 사람들 */}
      <div className='flex flex-col gap-1.5'>
        <div className='flex items-start gap-0.5'>
          <span className='text-title-8 text-gray-600'>이미 투표한 사람들</span>
          <div className='bg-error-default mt-0.75 h-0.75 w-0.75 rounded-full' />
        </div>
        {participants.length > 0 ? (
          <div className='flex flex-wrap gap-1.5'>
            {participants.map((participant) => (
              <div
                key={participant.id}
                className='flex items-center justify-center gap-1 rounded-md bg-gray-50 py-1.5 pr-2.5 pl-3'
              >
                <span className='text-body-4 text-text-primary'>
                  {participant.name}
                </span>
                <Icon
                  name='ic_circle_x_filled'
                  size={16}
                  color='var(--color-gray-400)'
                  onClick={() => onRemoveParticipant(participant.id)}
                  className='cursor-pointer'
                />
              </div>
            ))}
          </div>
        ) : (
          <p className='text-body-4 text-gray-400'>아직 투표한 사람이 없어요</p>
        )}
      </div>
    </div>
  );
}
