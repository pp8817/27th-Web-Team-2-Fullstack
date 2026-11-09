interface KakaoAuth {
  authorize(settings: {
    redirectUri: string;
    scope?: string;
    state?: string;
  }): void;
  getAccessToken(): string | null;
  setAccessToken(token: string): void;
  logout(callback?: () => void): void;
}

interface KakaoShareContent {
  title: string;
  description?: string;
  imageUrl?: string;
  link: {
    mobileWebUrl?: string;
    webUrl?: string;
  };
  imageWidth?: number;
  imageHeight?: number;
}

interface KakaoShareButton {
  title: string;
  link: {
    mobileWebUrl?: string;
    webUrl?: string;
  };
}

interface KakaoShareSendDefaultFeed {
  objectType: 'feed';
  content: KakaoShareContent;
  buttons?: KakaoShareButton[];
  serverCallbackArgs?: Record<string, string>;
}

interface KakaoShareSendDefaultCalendar {
  objectType: 'calendar';
  idType: 'event' | 'calendar';
  id: string;
  content: KakaoShareContent;
  buttons?: KakaoShareButton[];
}

interface KakaoShareSendDefaultText {
  objectType: 'text';
  text: string;
  link: {
    mobileWebUrl?: string;
    webUrl?: string;
  };
  buttons?: KakaoShareButton[];
}

type KakaoShareSendDefaultSettings =
  | KakaoShareSendDefaultFeed
  | KakaoShareSendDefaultCalendar
  | KakaoShareSendDefaultText;

interface KakaoShare {
  sendDefault(settings: KakaoShareSendDefaultSettings): void;
}

interface KakaoStatic {
  init(appKey: string): void;
  isInitialized(): boolean;
  Auth: KakaoAuth;
  Share: KakaoShare;
}

interface Window {
  Kakao: KakaoStatic;
}
