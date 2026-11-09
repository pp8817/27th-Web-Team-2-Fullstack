# 웨딘 DB·Supabase Auth·Vercel 인계

Vercel 프로젝트 하나가 웨딘 화면과 API를 제공합니다. Supabase Auth는 Google·Kakao 로그인, 세션 갱신과 로그아웃을 관리합니다. Next.js 서버가 PostgreSQL에서 모임과 투표를 읽고 씁니다.

## 1. 새 PostgreSQL 준비

1. Preview와 Production에 각각 사용할 신규 DB 또는 스키마를 준비합니다. 애플리케이션의 접속 문자열은 풀링 주소를 사용하고 SQL 적용에는 관리용 주소를 사용합니다.
2. 앱 DB도 Supabase에 두는 경우 해당 프로젝트에서 Data API를 끕니다. 모임과 투표는 Vercel의 Next.js API를 통해 접근합니다.
3. 아래 SQL을 순서대로 한 번씩 적용합니다.

```bash
for version in 1 2 4 5 6 7 8 10 11 14; do
  for migration in db/migrations/V"${version}"_*.sql; do
    psql "$MIGRATION_DATABASE_URL" -X -v ON_ERROR_STOP=1 -1 -f "$migration" || exit 1
  done
done
```

V14는 Supabase 사용자 UUID를 웨딘 사용자에 연결합니다. 신규 DB에서 첫 로그인 때 사용자 행이 생성되고, 재로그인 후에도 동일한 주최자 ID를 사용합니다. V3·V9는 이전 인증의 기록용 SQL입니다.

## 2. Supabase Auth 설정

1. Authentication에서 Google과 Kakao 공급자를 켜고 각 OAuth 앱의 Client ID와 Secret을 입력합니다. Google과 Kakao 콘솔에는 Supabase 공급자 화면이 표시하는 콜백 주소를 등록합니다. 일반적인 주소는 `https://<project-ref>.supabase.co/auth/v1/callback`입니다.
2. Site URL을 해당 환경의 앱 주소로 설정합니다. 다른 출처도 같은 Supabase 프로젝트를 사용하면 Redirect URLs에 `<앱 주소>/api/v1/auth/callback\?**`를 추가합니다. 이 패턴은 콜백 경로를 제한하면서 로그인 시도 값과 PKCE 흐름 ID가 담긴 쿼리를 허용합니다. Preview에는 고정 도메인을 사용합니다.
3. 마이페이지에서 Google·Kakao 계정을 연결하려면 Authentication 설정에서 **Manual Linking**을 켭니다.
4. Kakao에서 닉네임·프로필 이미지 동의 항목을 설정합니다. 이메일 동의 항목을 사용할 수 없으면 Supabase Kakao 설정에서 이메일 없는 사용자를 허용합니다. 톡캘린더를 제공하는 환경은 Kakao 앱의 톡캘린더 사용 권한과 `talk_calendar` 동의 항목도 설정합니다.

[Supabase Google 설정](https://supabase.com/docs/guides/auth/social-sign-in/auth-google) · [Supabase Kakao 설정](https://supabase.com/docs/guides/auth/social-sign-in/auth-kakao) · [리다이렉트 허용 목록](https://supabase.com/docs/guides/auth/redirect-urls) · [계정 연동](https://supabase.com/docs/guides/auth/auth-identity-linking)

## 3. Vercel 설정

Git 저장소를 가져와 Root Directory는 저장소 루트, Framework Preset은 Next.js, Node.js는 24.x로 지정합니다. 설치 명령은 `npm ci`, 빌드 명령은 `npm run build`입니다. Preview와 Production에는 각각 다음 값을 설정합니다.

| 이름                                     | 설정값                                                                                         |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                           | 환경별 PostgreSQL 풀링 주소. DB 제공자가 안내하는 TLS 설정을 적용합니다.                       |
| `NEXT_PUBLIC_BASE_URL`                   | 공유 링크에 사용하는 HTTPS 주소.                                                               |
| `APP_ORIGIN`                             | OAuth 콜백에 사용하는 HTTPS 주소. 보통 공유 링크 주소와 같습니다.                              |
| `SUPABASE_URL`                           | Supabase 프로젝트 URL.                                                                         |
| `SUPABASE_PUBLISHABLE_KEY`               | Supabase 프로젝트의 publishable key.                                                           |
| `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET` | 톡캘린더 토큰 갱신에 필요한 카카오 REST API 키와 Secret. Supabase에 등록한 앱과 같아야 합니다. |
| `NEXT_PUBLIC_KAKAO_JS_KEY`               | 카카오톡 공유용 JavaScript 키. 카카오 콘솔에 앱 도메인도 등록합니다.                           |

Supabase는 서비스 로그인 세션을 갱신합니다. Vercel에 카카오 REST API 키와 Secret을 함께 넣은 환경에서만 웨딘이 톡캘린더 동의를 요청합니다. 톡캘린더 호출에 필요한 Kakao 공급자 토큰은 Next.js 서버가 저장하고 갱신합니다. Google OAuth Secret은 Supabase에 설정합니다.

[Vercel 환경 변수](https://vercel.com/docs/environment-variables) · [Supabase Data API 설정](https://supabase.com/docs/guides/api/securing-your-api) · [Kakao 톡캘린더 API](https://developers.kakao.com/docs/en/talkcalendar/rest-api)

## 4. Preview 검증

1. `GET /api/v1/health`의 응답으로 앱 기동을 확인합니다.
2. Google·Kakao 로그인과 로그아웃, 재로그인 후 같은 모임이 표시되는지 확인합니다. 마이페이지에서 다른 공급자를 연결하고, 연결한 계정으로 재로그인해도 같은 모임에 접근하는지 확인합니다.
3. 주최자로 모임을 만들고 별도 브라우저에서 초대 링크를 열어 투표를 제출·수정합니다. 이후 주최자가 날짜를 확정하고, 초대 링크에서 결과가 표시되는지 확인합니다.
4. 카카오 계정으로 카카오톡 공유와 톡캘린더 등록을 확인합니다. 톡캘린더 등록에는 사용 권한과 사용자의 동의가 필요합니다.

참여자는 초대 링크와 이름으로 투표를 수정합니다. 계정 탈퇴와 소셜 연동 해제는 기존과 동일하게 지원 범위 밖입니다.
