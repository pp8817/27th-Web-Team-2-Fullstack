'use client';

import { useSyncExternalStore } from 'react';

import { getStoredUserInfo } from '@/shared/lib/storage';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('storage', callback);
  };
}

function getSnapshot() {
  return getStoredUserInfo()?.name || '게스트';
}

function getServerSnapshot() {
  return '게스트';
}

export function useHostName() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
