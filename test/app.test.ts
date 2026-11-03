import assert from 'node:assert/strict';
import type { Server } from 'http';
import { after, before, test } from 'node:test';
import app from '../src/app.js';

let server: Server;
let baseUrl: string;

before(async () => {
  await new Promise<void>((resolve, reject) => {
    server = app.listen(0, '127.0.0.1', (error?: Error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  const address = server.address();

  if (!address || typeof address === 'string') {
    throw new Error('Could not determine the test server port');
  }

  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(() => {
  server.close();
});

test('GET /api/health returns a healthy response', async () => {
  const response = await fetch(`${baseUrl}/api/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: 'ok',
  });
});

test('GET / renders the application version', async () => {
  const response = await fetch(`${baseUrl}/`);

  assert.equal(response.status, 200);
  assert.match(await response.text(), /Version development/);
});

test('GET /styles.css serves the application stylesheet', async () => {
  const response = await fetch(`${baseUrl}/styles.css`);

  assert.equal(response.status, 200);
  assert.match(await response.text(), /background-color/);
});
