import { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface TextHighlightProps {
  children: ReactNode;
  className?: string;
}

export function TextHighlight({ children, className }: TextHighlightProps) {
  return (
    <span className={cn('text-primary-default', className)}>{children}</span>
  );
}
