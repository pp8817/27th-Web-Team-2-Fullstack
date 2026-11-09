'use client';

import { useState } from 'react';

import Icon from '@/shared/ui/icon/Icon';

interface NumberStepperProps {
  onChange: (value: number) => void;
  max?: number;
  defaultValue?: number;
  className?: string;
}

export default function NumberStepper({
  onChange,
  max,
  defaultValue,
  className,
}: NumberStepperProps) {
  const [value, setValue] = useState(defaultValue ?? 1);
  const [isFocused, setIsFocused] = useState(false);

  const isMin = value <= 1;
  const isMax = max !== undefined && value >= max;

  function handleDecrement() {
    if (isMin) return;
    const next = value - 1;
    setValue(next);
    onChange(next);
  }

  function handleIncrement() {
    if (isMax) return;
    const next = value + 1;
    setValue(next);
    onChange(next);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw === '') {
      setValue(0);
      onChange(0);
      return;
    }
    const num = parseInt(raw, 10);
    if (max !== undefined && num > max) return;
    setValue(num);
    onChange(num);
  }

  function handleBlur() {
    setIsFocused(false);
    if (value < 1) {
      setValue(1);
      onChange(1);
    }
  }

  function getIconColor(isDisabled: boolean) {
    if (isDisabled) return 'var(--color-gray-400)';
    if (isFocused) return 'var(--color-gray-800)';
    return 'var(--color-text-primary)';
  }

  return (
    <div
      className={`inline-flex h-9 w-[121px] items-center gap-[10px] rounded-lg border-none bg-gray-50 px-[10px] py-1 ${className || ''}`}
    >
      <button
        type='button'
        onClick={handleDecrement}
        disabled={isMin}
        aria-label='감소'
        className='flex shrink-0 cursor-pointer items-center justify-center disabled:cursor-default'
      >
        <Icon name='ic_minus' size={20} color={getIconColor(isMin)} />
      </button>

      <input
        type='text'
        inputMode='numeric'
        value={value === 0 ? '' : value}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className='bg-gray-0 text-body-4 text-text-primary h-7 w-[41px] rounded text-center outline-none'
        aria-label='수량'
      />

      <button
        type='button'
        onClick={handleIncrement}
        disabled={isMax}
        aria-label='증가'
        className='flex shrink-0 cursor-pointer items-center justify-center disabled:cursor-default'
      >
        <Icon name='ic_plus' size={20} color={getIconColor(isMax)} />
      </button>
    </div>
  );
}
