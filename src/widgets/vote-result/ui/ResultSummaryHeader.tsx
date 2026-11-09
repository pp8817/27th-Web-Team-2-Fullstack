import { format } from 'date-fns';

import { parseDate } from '@/shared/lib/date';
import { Header } from '@/shared/ui/header/Header';
import { TextHighlight } from '@/shared/ui/text/Highlight';

interface ResultSummaryHeaderProps {
  votedCount: number;
  representativeDate: string | null;
  standardTime: string;
}

function formatRepresentativeDate(date: string) {
  return format(parseDate(date), 'M월 d일');
}

export function ResultSummaryHeader({
  votedCount,
  representativeDate,
  standardTime,
}: ResultSummaryHeaderProps) {
  if (votedCount === 0) {
    return (
      <Header
        variant='subHeader'
        title={'아직 아무도\n투표하지 않았어요'}
        standardTime={standardTime}
      />
    );
  }

  const title = representativeDate ? (
    <>
      <TextHighlight>
        {formatRepresentativeDate(representativeDate)}
      </TextHighlight>
      이<br />
      가장 유력해요
    </>
  ) : (
    `${votedCount}명이 투표했어요`
  );

  return <Header title={title} standardTime={standardTime} />;
}
