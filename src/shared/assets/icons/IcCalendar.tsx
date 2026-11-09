import type { SVGProps } from 'react';

export default function IcCalendar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='100%'
      height='100%'
      viewBox='-3.25 -2.25 24 24'
      fill='none'
      {...props}
    >
      <path
        d='M12.75 0.75V4.75M4.75 0.75V4.75M0.75 8.75H16.75M0.75 4.75C0.75 4.21957 0.960714 3.71086 1.33579 3.33579C1.71086 2.96071 2.21957 2.75 2.75 2.75H14.75C15.2804 2.75 15.7891 2.96071 16.1642 3.33579C16.5393 3.71086 16.75 4.21957 16.75 4.75V16.75C16.75 17.2804 16.5393 17.7891 16.1642 18.1642C15.7891 18.5393 15.2804 18.75 14.75 18.75H2.75C2.21957 18.75 1.71086 18.5393 1.33579 18.1642C0.960714 17.7891 0.75 17.2804 0.75 16.75V4.75Z'
        stroke='currentColor'
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
