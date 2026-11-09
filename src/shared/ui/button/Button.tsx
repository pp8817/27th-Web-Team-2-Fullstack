import { ComponentProps } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  /**
   * 버튼에 표시될 텍스트입니다.
   */
  children: React.ReactNode;
  /**
   * true일 경우 버튼의 너비를 100%로 설정합니다.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * 버튼 비활성화 상태입니다.
   * @default false
   */
  disabled?: boolean;
  /**
   * 버튼 스타일 변형입니다.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'dark';
}

/**
 * Figma 디자인 시스템의 CTA Button 컴포넌트입니다.
 * - 높이: 56px
 * - Border radius: 8px
 * - Default: text-primary 배경
 * - Disabled: primary-default 배경 + 30% opacity
 */
const VARIANT_CLASS: Record<string, string> = {
  primary: 'button-primary',
  secondary: 'button-secondary',
  dark: 'button-dark',
};

export default function Button({
  children,
  fullWidth = false,
  disabled = false,
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  const buttonClasses = [
    'button-base',
    VARIANT_CLASS[variant],
    fullWidth ? 'button-full-width' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type='button'
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
