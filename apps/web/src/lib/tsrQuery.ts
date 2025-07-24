import { initTsrReactQuery } from '@ts-rest/react-query/v5';
import { contract } from '@cooper/ts-rest/src/contract';

export const tsr = initTsrReactQuery(contract, {
  baseUrl: '', // the Next.js server (from client)
  credentials: 'include', // for our cookie based sessions
});
