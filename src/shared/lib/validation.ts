const HOST_NAME_PATTERN = /^[ㄱ-힣a-zA-Z ]*$/;

export function validateHostName(value: string) {
  if (!HOST_NAME_PATTERN.test(value)) {
    return '한글, 영문만 입력 가능해요';
  }
  return '';
}
