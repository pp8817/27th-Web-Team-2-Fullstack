import type { SVGProps } from 'react';

export default function IcPencil(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='100%'
      height='100%'
      viewBox='-3.25 -3.92 24 24'
      fill='none'
      {...props}
    >
      <path
        d='M10.25 2.57843L14.25 6.57843M0.75 16.0784H4.75L15.25 5.57843C15.7804 5.04799 16.0784 4.32857 16.0784 3.57843C16.0784 2.82828 15.7804 2.10886 15.25 1.57843C14.7196 1.04799 14.0001 0.75 13.25 0.75C12.4999 0.75 11.7804 1.04799 11.25 1.57843L0.75 12.0784V16.0784Z'
        stroke='currentColor'
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
