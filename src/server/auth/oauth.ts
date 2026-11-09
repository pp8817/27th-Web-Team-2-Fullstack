// Supabase OAuth 로그인과 계정 연동을 시작하고 콜백을 처리한다.
import { randomUUID } from 'node:crypto';

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { transaction } from '@/server/db';
import { noStore, parse } from '@/server/http';

import { saveKakaoToken } from './kakao';
import {
  appOrigin,
  createAuthClient,
  registerUser,
  requireAuthUser,
  sessionCookieOptions,
} from './session';

const targetSchema = z.enum(['list', 'create', 'mypage', 'account']);
const flowSchema = z.object({
  nonce: z.uuid(),
  calendarConsent: z.boolean(),
  target: targetSchema,
  flowId: z.string().min(1),
  linkUserId: z.string().optional(),
});

type Provider = 'google' | 'kakao';

function flowCookieName(site: string) {
  return site.startsWith('https:') ? '__Host-weddin-oauth' : 'weddin-oauth';
}

export async function beginOAuth(request: NextRequest, provider: Provider) {
  const site = appOrigin(request);
  const target = parse(
    targetSchema,
    request.nextUrl.searchParams.get('target') ?? 'list',
  );
  const nonce = randomUUID();
  const redirectTo = new URL('/api/v1/auth/callback', site);
  redirectTo.searchParams.set('attempt', nonce);

  const client = await createAuthClient(request);
  const linkUserId =
    target === 'account' ? (await requireAuthUser(client)).id : undefined;
  const calendarConsent =
    provider === 'kakao' &&
    Boolean(process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET);
  const credentials = {
    provider,
    options: {
      redirectTo: redirectTo.href,
      scopes: calendarConsent ? 'talk_calendar' : undefined,
    },
  };
  const { data, error } = linkUserId
    ? await client.auth.linkIdentity(credentials)
    : await client.auth.signInWithOAuth(credentials);
  if (error || !data.url || !data.flowId) {
    return NextResponse.redirect(new URL('/auth/failure', site), {
      headers: noStore,
    });
  }

  const jar = await cookies();
  jar.set(
    flowCookieName(site),
    Buffer.from(
      JSON.stringify({
        nonce,
        calendarConsent,
        target,
        flowId: data.flowId,
        linkUserId,
      }),
    ).toString('base64url'),
    { ...sessionCookieOptions(request), maxAge: 600 },
  );
  return NextResponse.redirect(data.url, { headers: noStore });
}

export async function completeOAuth(request: NextRequest) {
  const site = appOrigin(request);
  const jar = await cookies();
  const name = flowCookieName(site);
  const callback = request.nextUrl.searchParams;
  const failure = () =>
    NextResponse.redirect(new URL('/auth/failure', site), { headers: noStore });

  try {
    const value = jar.get(name)?.value;
    if (!value) return failure();
    const flow = flowSchema.parse(
      JSON.parse(Buffer.from(value, 'base64url').toString()),
    );
    if (
      callback.get('attempt') !== flow.nonce ||
      callback.get('sb_flow_id') !== flow.flowId
    ) {
      return failure();
    }

    jar.set(name, '', { ...sessionCookieOptions(request), maxAge: 0 });
    const code = callback.get('code');
    if (!code) return failure();

    const client = await createAuthClient(request);
    if (
      flow.linkUserId &&
      (await requireAuthUser(client)).id !== flow.linkUserId
    ) {
      return failure();
    }
    const { data, error } = await client.auth.exchangeCodeForSession(code, {
      flowId: flow.flowId,
    });
    if (error || !data.user || !data.session) return failure();
    if (flow.linkUserId && data.user.id !== flow.linkUserId) {
      await client.auth.signOut({ scope: 'local' });
      return failure();
    }

    const { provider_token, provider_refresh_token } = data.session;
    await transaction(async (client) => {
      const userId = await registerUser(client, data.user);
      if (flow.calendarConsent && provider_token) {
        await saveKakaoToken(client, userId, {
          access_token: provider_token,
          refresh_token: provider_refresh_token ?? undefined,
        });
      }
    });

    const target =
      flow.target === 'account'
        ? '/mypage/account'
        : `/auth/callback?state=${flow.target}`;
    return NextResponse.redirect(new URL(target, site), { headers: noStore });
  } catch (error) {
    console.error(
      'Weddin OAuth callback failed',
      error instanceof Error ? error.name : '',
    );
    return failure();
  }
}

export async function socialAccounts(request: NextRequest) {
  const user = await requireAuthUser(await createAuthClient(request));
  const accounts = (user.identities ?? [])
    .filter(({ provider }) => provider === 'kakao' || provider === 'google')
    .sort((left, right) =>
      (left.created_at ?? '').localeCompare(right.created_at ?? ''),
    )
    .map(({ provider, identity_data }) => ({
      provider: provider.toUpperCase(),
      email:
        typeof identity_data?.email === 'string' ? identity_data.email : null,
    }));
  return { providers: accounts.map(({ provider }) => provider), accounts };
}
