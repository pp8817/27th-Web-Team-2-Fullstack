-- 웨딘 사용자와 Supabase 계정을 연결하고 공급자 토큰의 선택적 만료 시간을 지원한다.
ALTER TABLE users ADD COLUMN supabase_user_id UUID UNIQUE;

ALTER TABLE social_oauth_tokens ALTER COLUMN access_token_expires_at DROP NOT NULL;
