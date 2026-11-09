# 웨딘 디자인 작업 인계

원본 FE 작업 명세에 연결된 두 Figma 파일을 기준으로 화면과 공통 컴포넌트를 수정합니다. 웹에 적용할 변경은 대응하는 React 컴포넌트와 CSS에도 반영합니다.

- [웨딘 화면 디자인](https://www.figma.com/design/kjt0NlzcnPCuy5NsVHUuOY/weddin-UI-Design)
- [웨딘 디자인 시스템](https://www.figma.com/design/fzfBdfbxvfYvIHuS6gTg02/weddin-Design-system)

## Storybook에서 시작하기

저장소 폴더를 터미널에서 열고 Node.js 24로 실행합니다.

```sh
npm ci
npm run storybook
```

브라우저에서 `http://127.0.0.1:6006`을 엽니다. Storybook은 샘플 데이터로 실행되므로 DB나 Supabase 설정 없이 버튼, 입력창, 바텀시트, 모임 카드, 투표 결과 달력을 수정하고 확인할 수 있습니다. 컴포넌트를 고친 뒤 같은 폴더의 `*.stories.tsx`에서 기본·빈 화면·선택 상태 등 해당 변경의 영향을 받는 예시를 확인합니다.

| 변경할 내용                               | 코드 위치                                                |
| ----------------------------------------- | -------------------------------------------------------- |
| 공통 색상, 글꼴, 글자 크기                | `src/app/globals.css`의 `@theme`과 타이포그래피 유틸리티 |
| 버튼, 입력창, 바텀시트 등 공통 UI         | `src/shared/ui/`                                         |
| 홈 로그인, 모임 목록, 달력 등 기능별 화면 | `src/features/<기능>/ui/`                                |
| 페이지 주소와 화면 조립                   | `src/app/`                                               |
| SVG 아이콘                                | `src/shared/assets/icons/`와 `iconRegistry.ts`           |
| 로고, 온보딩 이미지, 공유 이미지          | `public/`                                                |

## 전체 화면 확인하기

`npm run dev`로 앱을 실행하면 `http://localhost:3000`에서 홈과 화면 흐름을 볼 수 있습니다. 실제 로그인, 모임 생성, 초대 링크 투표를 확인할 때는 DB와 인증이 연결된 테스트 환경을 사용합니다. 설정은 [DB·Supabase·Vercel 인계 문서](handoff.md)에 있습니다.

화면 변경은 모바일 폭에서 먼저 확인하고, 긴 모임 이름이나 참여자가 많은 예시도 살펴봅니다. 작업을 넘길 때는 변경한 Figma 프레임과 확인한 Storybook 스토리 또는 화면 주소를 함께 남깁니다.
