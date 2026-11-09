import Image from 'next/image';

import HomeLoginButtons from '@/features/landing/ui/HomeLoginButtons';

export default function Home() {
  return (
    <div className='relative flex min-h-dvh flex-col bg-gray-50'>
      {/* Background image with luminosity blend */}
      <div className='absolute inset-0 opacity-50 mix-blend-luminosity'>
        <Image
          src='/onboarding-bg-original.jpg'
          alt=''
          fill
          className='object-cover'
          priority
        />
      </div>

      {/* Center content */}
      <div className='relative z-10 flex flex-1 flex-col items-center justify-center gap-4'>
        <Image
          src='/app-icon.png'
          alt='weddin'
          width={89}
          height={89}
          className='rounded-[20px]'
        />
        <Image src='/weddin-logo.svg' alt='weddin' width={166} height={39} />
        <p className='text-text-tertiary text-sm font-medium tracking-tight'>
          청첩장 모임 일정 관리를 가장 쉽고 빠르게
        </p>
      </div>

      {/* Bottom CTA */}
      <div className='relative z-10 w-full px-5 pb-5'>
        <HomeLoginButtons />
      </div>
    </div>
  );
}
