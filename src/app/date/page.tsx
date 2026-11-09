import { Suspense } from 'react';

import DateSelectPage from '@/features/meet-create-date/ui/DateSelectPage';

export default function DatePage() {
  return (
    <Suspense>
      <DateSelectPage />
    </Suspense>
  );
}
