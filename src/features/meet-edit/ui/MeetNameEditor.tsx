'use client';

import Icon from '@/shared/ui/icon/Icon';
import Input from '@/shared/ui/input/Input';

interface MeetNameEditorProps {
  title: string;
  isEditing: boolean;
  onStartEditing: () => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  errorMessage: string;
}

export default function MeetNameEditor({
  title,
  isEditing,
  onStartEditing,
  onTitleChange,
  onClear,
  errorMessage,
}: MeetNameEditorProps) {
  if (isEditing) {
    return (
      <Input
        value={title}
        maxLength={10}
        onChange={onTitleChange}
        onClear={onClear}
        errorMessage={errorMessage}
        fullWidth
        autoFocus
        autoComplete='off'
      />
    );
  }

  return (
    <div className='flex items-center gap-2'>
      <div
        className='bg-primary-default/5 flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2'
        onClick={onStartEditing}
      >
        <span className='text-title-6 text-primary-default'>{title}</span>
        <Icon name='ic_pencil' size={16} color='var(--color-primary-default)' />
      </div>
      <span className='text-title-4 text-text-primary'>모임이에요</span>
    </div>
  );
}
