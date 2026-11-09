import { User } from '@/entities/user/dto/user.dto';

const USER_INFO_KEY = 'user_info';

export function getStoredUserInfo(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_INFO_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setStoredUserInfo(user: User): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
  } catch {
    // localStorage 사용 불가 시 무시
  }
}

export function clearStoredUserInfo(): void {
  try {
    localStorage.removeItem(USER_INFO_KEY);
  } catch {
    // localStorage 사용 불가 시 무시
  }
}
