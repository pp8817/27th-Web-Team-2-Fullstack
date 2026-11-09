import { ReactNode } from 'react';

import Icon from '../icon/Icon';

interface HeaderProps {
  /**
   * 헤더의 변형(Variant)을 결정합니다.
   * - default: 투표 수와 기준 시간이 표시되는 헤더
   * - subHeader: 타이틀만 있는 서브 헤더
   * - thirdTitle: 타이틀과 서브 타이틀이 있는 헤더
   * - thirdHeader: 텍스트가 두 줄 이상 들어갈 수 있는 헤더
   */
  variant?: 'default' | 'subHeader' | 'thirdTitle' | 'thirdHeader';

  /**
   * 메인 타이틀 텍스트입니다.
   * Variant가 'default'일 때는 투표 수 텍스트를 대체합니다(옵션).
   */
  title?: ReactNode;

  /**
   * 서브 타이틀 텍스트입니다.
   * Variant가 'thirdTitle'일 때 사용됩니다.
   */
  subTitle?: string;

  /**
   * (Default Variant 전용) 기준 시간 텍스트입니다. 예: "20:13"
   */
  standardTime?: string;

  /**
   * (Default Variant 전용) 새로고침 아이콘 클릭 핸들러입니다.
   */
  onRefresh?: () => void;

  className?: string;
}

export function Header({
  variant = 'default',
  title,
  subTitle,
  standardTime,
  onRefresh,
  className = '',
}: HeaderProps) {
  return (
    <header className={`flex w-full flex-col ${className}`}>
      {/* Default Variant */}
      {variant === 'default' && (
        <div className='flex w-full items-start justify-between px-5 pt-6 pb-2'>
          <div className='text-headline-5 text-text-primary'>{title}</div>

          {(standardTime || onRefresh) && (
            <button
              onClick={onRefresh}
              className='text-text-tertiary text-caption-6 flex cursor-pointer items-center justify-center gap-1'
              type='button'
            >
              {/* Refresh Icon Placeholder or SVG */}
              <Icon name='ic_refresh' size={16} />
              <span>{standardTime} 기준</span>
            </button>
          )}
        </div>
      )}

      {/* SubHeader Variant */}
      {variant === 'subHeader' && (
        <div className='flex w-full items-center px-5 pt-6 pb-2'>
          <h2 className='text-title-4 text-text-primary whitespace-pre-wrap'>
            {title}
          </h2>
        </div>
      )}

      {/* ThirdTitle Variant */}
      {variant === 'thirdTitle' && (
        <div className='flex w-full flex-col gap-1 bg-white px-5 pt-6 pb-2'>
          <h2 className='text-headline-5 text-text-primary'>{title}</h2>
          {subTitle && (
            <p className='text-body-5 text-text-tertiary'>{subTitle}</p>
          )}
        </div>
      )}

      {/* ThirdHeader Variant (New) */}
      {variant === 'thirdHeader' && (
        <div className='flex w-full items-center bg-white px-5 pt-6 pb-2'>
          <h2 className='text-title-4 text-text-primary break-keep whitespace-pre-wrap'>
            {title}
          </h2>
        </div>
      )}
    </header>
  );
}
