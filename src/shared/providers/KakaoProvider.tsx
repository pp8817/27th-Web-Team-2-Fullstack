'use client';

import Script from 'next/script';
import { createContext, useCallback, useContext, useState } from 'react';

interface KakaoContextType {
  isReady: boolean;
}

const KakaoContext = createContext<KakaoContextType>({ isReady: false });

export function useKakao() {
  return useContext(KakaoContext);
}

export function KakaoProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  const handleLoad = useCallback(() => {
    const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (window.Kakao && !window.Kakao.isInitialized() && key) {
      window.Kakao.init(key);
      setIsReady(window.Kakao.isInitialized());
    }
  }, []);

  return (
    <KakaoContext.Provider value={{ isReady }}>
      <Script
        src='https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js'
        crossOrigin='anonymous'
        strategy='afterInteractive'
        onLoad={handleLoad}
      />
      {children}
    </KakaoContext.Provider>
  );
}
