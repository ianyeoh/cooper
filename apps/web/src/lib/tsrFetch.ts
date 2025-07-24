import { contract } from '@cooper/ts-rest/src/contract';
import { initClient, tsRestFetchApi } from '@ts-rest/core';
import { cookies } from 'next/headers';

/**
 * Forward cookies from request to Next.js page to the backend API server
 */
async function proxyServerCookies() {
  const allCookies = (await cookies()).getAll();
  return allCookies
    .map((cookie) => `${cookie.name}=${cookie.value};`)
    .join(' ');
}

/**
 * Fetch client with ts-rest typing.
 *
 * Use for server side backend API calls (e.g. middleware, server components)
 */
export const fetch = initClient(contract, {
  baseUrl: 'http://localhost:3000', // self reference to Next.js server (from server)
  credentials: 'include', // for our cookie based sessions
  api: async (args) => {
    args.headers.cookie = await proxyServerCookies();
    return tsRestFetchApi(args);
  },
});
