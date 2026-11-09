# Weddin

청첩장 모임의 후보 날짜를 모아 투표하고 일정을 확정하는 서비스입니다. Next.js 앱 하나에서 웨딘 화면과 `/api/v1/*`를 제공합니다.

- 화면과 에셋은 [웨딘 FE develop](https://github.com/nomoney-w2/weddin/tree/54173fc3dce8041523ace32ff790d7fed3a300af)을 기준으로 가져왔습니다.
- API의 날짜 투표와 주최자 관리 규칙은 [기존 BE main](https://github.com/YAPP-Github/27th-Web-Team-2-BE/tree/87913d2bdc5a9074e72e4d3e040b70f3f8d9163c)을 기준으로 옮겼습니다.

## 로컬 실행

Node.js 24가 필요합니다.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

`http://localhost:3000`에서 홈과 화면을 확인할 수 있습니다. 로그인, 모임 생성과 투표까지 확인하려면 PostgreSQL과 Supabase Auth 설정이 필요합니다. `npm run storybook`으로 기존 컴포넌트 스토리를 볼 수 있습니다.

```sh
npm run typecheck
npm run lint
npm run build
```

Figma 원본, Storybook 실행과 화면 수정 위치는 [디자인 작업 인계](docs/design-handoff.md)를 참고하세요.

운영 DB, Supabase Auth, Vercel 프로젝트 설정은 [인계 문서](docs/handoff.md)를 참고하세요.
