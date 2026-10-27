import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchData } from '../js/services/api.js';

test('API errors reject rather than returning unusable response data', async () => {
 const original=globalThis.fetch;
 try {
  globalThis.fetch=async()=>new Response('Quota exceeded',{status:429});
  await assert.rejects(fetchData('https://example.invalid'),/request failed/);
 } finally {globalThis.fetch=original;}
});
