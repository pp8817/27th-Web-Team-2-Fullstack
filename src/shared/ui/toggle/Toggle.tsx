import { ButtonHTMLAttributes } from 'react';

interface ToggleProps extends Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className'
> {
  checked: boolean;
  onChange: () => void;
}

export default function Toggle({ checked, onChange, className }: ToggleProps) {
  return (
    <button
      type='button'
      role='switch'
      aria-checked={checked}
      onClick={onChange}
      className={`flex h-[30px] w-[54px] shrink-0 items-center overflow-hidden rounded-full p-1 transition-colors duration-200 ${
        checked ? 'bg-primary-default' : 'bg-gray-100'
      } ${className || ''}`}
    >
      <div
        className={`bg-gray-0 size-[22px] rounded-full shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
