'use client';

import Icon from '@/shared/ui/icon/Icon';

interface VoteCompleteOverlayProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  confirmText?: string;
  onConfirm: () => void;
  onClose?: () => void;
}

export default function VoteCompleteOverlay({
  isOpen,
  title,
  subtitle,
  confirmText = '확인',
  onConfirm,
  onClose,
}: VoteCompleteOverlayProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className='absolute inset-0 z-50 flex flex-col bg-cover bg-center px-5 pb-8.5'
      style={{ backgroundImage: "url('/vote-complete-bg.png')" }}
    >
      <button
        type='button'
        onClick={onClose ?? onConfirm}
        className='absolute top-5 right-5 z-10'
        aria-label='닫기'
      >
        <Icon name='ic_menu_close' size={28} className='text-text-secondary' />
      </button>

      <div className='flex flex-col items-center gap-1.5 pt-[172px] text-center'>
        <h2 className='text-headline-5 text-text-primary whitespace-pre-wrap'>
          {title}
        </h2>
        <p className='text-body-3 text-text-secondary whitespace-pre-wrap'>
          {subtitle}
        </p>
      </div>

      <div className='flex-1' />

      <button
        type='button'
        onClick={onConfirm}
        className='flex w-full items-center justify-center rounded-xl bg-[rgba(255,255,255,0.15)] px-5 py-4 active:bg-[rgba(255,255,255,0.25)]'
      >
        <span className='text-body-2 text-text-inverse'>{confirmText}</span>
      </button>
    </div>
  );
}
