import { format } from 'date-fns';

import { parseDate } from '@/shared/lib/date';
import { Header } from '@/shared/ui/header/Header';
import { TextHighlight } from '@/shared/ui/text/Highlight';

interface HostVoteStatusHeaderProps {
  notVotedCount: number;
  votedCount: number;
  representativeDate: string | null;
  standardTime: string;
  onRefresh?: () => void;
}

function formatRepresentativeDate(date: string) {
  return format(parseDate(date), 'M월 d일');
}

export function HostVoteStatusHeader({
  notVotedCount,
  votedCount,
  representativeDate,
  standardTime,
  onRefresh,
}: HostVoteStatusHeaderProps) {
  if (notVotedCount > 0) {
    const title = (
      <>
        아직 <TextHighlight>{notVotedCount}명</TextHighlight>이<br />
        투표하지 않았어요
      </>
    );

    return (
      <Header title={title} standardTime={standardTime} onRefresh={onRefresh} />
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

  return (
    <Header title={title} standardTime={standardTime} onRefresh={onRefresh} />
  );
}
