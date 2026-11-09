import type { HTMLAttributes } from 'react';

export default function IcHome(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className='relative h-full w-full' data-name='ic_home' {...props}>
      <svg
        width='100%'
        height='100%'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='block size-full'
      >
        <path
          d='M4.71 8.9L10.71 3.84C11.46 3.21 12.54 3.21 13.29 3.84L19.29 8.9C19.74 9.28 20 9.84 20 10.43V18.75C20 19.85 19.1 20.75 18 20.75H6C4.9 20.75 4 19.85 4 18.75V10.43C4 9.84 4.26 9.28 4.71 8.9Z'
          stroke='currentColor'
          strokeWidth='1.5'
        />
        <path
          d='M9.01 14.94C9.01 13.83 9.9 12.94 11.01 12.94H12.99C14.1 12.94 14.99 13.83 14.99 14.94V20.75H9.01V14.94Z'
          stroke='currentColor'
          strokeWidth='1.5'
        />
      </svg>
    </div>
  );
}
