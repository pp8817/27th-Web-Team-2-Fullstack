const MEET_NAME_PATTERN = /^[ㄱ-힣a-zA-Z ]*$/;

export function validateMeetName(title: string): string {
  if (title.trim().length === 0) {
    return '모임 이름을 입력해주세요';
  }
  if (title.trim().length > 10) {
    return '모임 이름은 10자 이하로 입력해주세요';
  }
  if (!MEET_NAME_PATTERN.test(title)) {
    return '한글, 영문만 입력 가능해요';
  }
  return '';
}

export function validateParticipantCount(
  count: number | null,
  currentParticipants: number,
): string {
  if (count !== null && count < currentParticipants) {
    return '투표 인원은 이미 투표한 사람 수보다 적을 수 없어요';
  }
  return '';
}
