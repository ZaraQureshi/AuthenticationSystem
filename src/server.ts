import 'reflect-metadata';
import './container/DI.ts'; // 👈 Ensures registration is done

import { serve } from '@hono/node-server';
import app from './index'; // points to your Hono app
const port = 3000;
const host = '0.0.0.0';

serve({
  fetch: app.fetch,
  port,
  hostname: host,
});

console.log(`🚀 Server running on http://${host}:${port}`);
