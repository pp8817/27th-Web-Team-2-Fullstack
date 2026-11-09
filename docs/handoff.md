# 웨딘 DB·Vercel 인계

웨딘은 저장소 루트의 Next.js 앱 하나로 배포합니다. 브라우저는 같은 출처의 `/api/v1/*`를 호출하고 초대 페이지는 서버에서 PostgreSQL을 직접 조회합니다. 배포 담당자가 PostgreSQL과 Vercel 프로젝트를 연결합니다.

## 1. PostgreSQL 준비

1. Preview와 Production에 각각 사용할 DB 또는 격리된 스키마를 준비합니다. 런타임에는 환경별 풀링 접속 주소를 사용하고, 스키마 적용은 관리용 접속 주소로 실행합니다.
2. 새 DB에는 `db/migrations/`의 기존 BE SQL을 V1부터 V11까지 번호순으로 한 번씩 적용합니다. 기존 DB는 먼저 백업과 적용 이력을 확인하고 빠진 버전만 적용합니다. 일부 파일에 트리거 생성이 있으므로 전체 파일을 다시 실행하면 실패할 수 있습니다.
3. `DATABASE_URL`에는 관리형 DB에서 제공하는 TLS 접속 설정을 포함합니다. 앱은 인스턴스당 최대 3개 연결을 사용합니다. DB 연결 한도는 Preview와 Production 인스턴스를 함께 고려해 설정합니다.

신규 DB에서 적용하는 예시입니다. `MIGRATION_DATABASE_URL`은 실행 환경에서 주입합니다.

```bash
for version in {1..11}; do
  for migration in db/migrations/V"${version}"_*.sql; do
    psql "$MIGRATION_DATABASE_URL" -X -v ON_ERROR_STOP=1 -1 -f "$migration" || exit 1
  done
done
```

이 SQL은 기존 `meetings`, `meeting_dates`, `participants`, 투표와 세션 및 소셜 로그인 테이블을 유지합니다. 날짜만 선택하는 웨딘 화면에 맞춰 V12·V13 시간 슬롯 SQL을 신규 DB 목록에서 제외했습니다. 기존 DB의 적용된 SQL과 컬럼은 그대로 둡니다. 기존 데이터를 옮길 때 날짜 전용 모임만 범위에 포함하고, 사용자 ID와 소셜 계정 식별자를 보존합니다. 공급자 앱을 바꾸는 경우 기존 Kakao 계정 식별자와 토큰이 새 앱에서 통용되는지 확인합니다.

새 웨딘 세션은 토큰 해시를 기존 인증 테이블에 저장합니다. 원본 서버와 새 앱을 동일한 쓰기 DB로 동시에 운영하면 새 세션을 원본 서버가 읽을 수 없으므로 전환 시 서버와 접속 주소를 함께 변경합니다.

## 2. Vercel 설정

- Git 저장소를 가져와 Root Directory를 저장소 루트로 선택합니다. Framework Preset은 Next.js, Node.js는 24.x입니다.
- Install Command는 `npm ci`, Build Command는 `npm run build`입니다. API는 Next.js의 Node.js Route Handler로 배포됩니다.
- 아래 값을 프로젝트의 Preview·Production 환경에 각각 설정합니다. OAuth 테스트에는 고정 Preview 도메인을 지정하고 그 주소를 공급자 콘솔에 등록합니다.

| 이름                                       | 설정값                                                                                                     |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                             | 환경별 PostgreSQL 풀링 주소. 서버 전용.                                                                    |
| `NEXT_PUBLIC_BASE_URL`                     | 공유 링크와 OG 이미지에 사용하는 환경별 HTTPS 출처.                                                        |
| `APP_ORIGIN`                               | OAuth 콜백과 리다이렉트에 쓰는 HTTPS 출처. 일반적으로 `NEXT_PUBLIC_BASE_URL`과 동일.                       |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google 웹 OAuth 클라이언트 설정. 서버 전용.                                                                |
| `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`   | Kakao REST API 키와 활성화된 경우 클라이언트 시크릿. 서버 전용.                                            |
| `KAKAO_SCOPE`                              | 기본값은 `profile_nickname,talk_calendar`. 톡캘린더 기능을 사용하려면 앱의 사용 권한과 동의 항목을 활성화. |
| `NEXT_PUBLIC_KAKAO_JS_KEY`                 | 카카오톡 공유에 사용하는 JavaScript 키. 사이트 도메인도 등록.                                              |

Google 콜백은 `<APP_ORIGIN>/api/v1/auth/oauth/google`, Kakao 콜백은 `<APP_ORIGIN>/api/v1/auth/oauth/kakao`입니다. 로컬 OAuth를 검증하는 경우에도 사용하는 로컬 출처의 콜백을 공급자에 등록합니다. 공급자 설정과 DB 접속 값은 Vercel 환경 변수로만 관리합니다.

## 3. Preview 검증과 운영 전환

1. `GET /api/v1/health`가 200을 반환하는지 확인합니다. 이 엔드포인트는 앱이 응답하는지만 검사합니다.
2. Google·Kakao 로그인 후 모임을 만들고, 별도 브라우저에서 초대 링크를 열어 투표합니다. 투표 수정, 중복 이름, 정원 제한, 주최자 메모, 공동 1위 날짜 확정과 확정 일정 조회를 확인합니다.
3. 로그인 쿠키와 계정 연동, 로그아웃을 확인합니다. 카카오 테스트 계정으로 카카오톡 공유와 톡캘린더 등록을 확인합니다.
4. Preview 검증 이후 Production 환경에 동일한 절차를 적용합니다. 이전 버전으로 되돌릴 때는 Vercel 배포와 DB 스키마의 호환성을 함께 확인합니다.

참여자 투표 수정은 원본 웨딘처럼 초대 링크와 이름으로 동작합니다. 이 흐름은 참여자 본인 인증을 제공하지 않습니다. 계정 탈퇴와 소셜 연동 해제는 원본 API에 정책과 동작이 정의되어 있지 않아 이번 이식에 포함하지 않았습니다.

[Vercel 빌드 설정](https://vercel.com/docs/builds/configure-a-build) · [Vercel 환경 변수](https://vercel.com/docs/environment-variables) · [Kakao 톡캘린더 API](https://developers.kakao.com/docs/en/talkcalendar/rest-api)
