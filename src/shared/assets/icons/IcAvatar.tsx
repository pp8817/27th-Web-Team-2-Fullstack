import type { SVGProps } from 'react';

export default function IcAvatar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='100%'
      height='100%'
      viewBox='0 0 24 24'
      fill='none'
      {...props}
    >
      <g clipPath='url(#ic_avatar_clip)'>
        <path
          d='M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z'
          fill='#EBEAEA'
        />
        <path
          d='M12 15.1426C16.9705 15.1426 20.9999 19.1722 21 24.1426C21 29.1132 16.9706 33.1426 12 33.1426C7.02944 33.1426 3 29.1132 3 24.1426C3.00015 19.1722 7.02953 15.1426 12 15.1426Z'
          fill='white'
        />
        <path
          d='M12.0031 4.01837C14.6066 4.01837 16.7177 6.1288 16.7179 8.73224C16.7179 11.3359 14.6067 13.4471 12.0031 13.4471C9.39964 13.4469 7.28921 11.3357 7.28921 8.73224C7.28943 6.12894 9.39978 4.0186 12.0031 4.01837Z'
          fill='white'
        />
      </g>
      <circle
        cx='12'
        cy='12'
        r='11.75'
        stroke='black'
        strokeOpacity='0.05'
        strokeWidth='0.5'
      />
      <defs>
        <clipPath id='ic_avatar_clip'>
          <path
            d='M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z'
            fill='white'
          />
        </clipPath>
      </defs>
    </svg>
  );
}
