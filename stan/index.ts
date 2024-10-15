import * as dotenv from 'dotenv';
dotenv.config();

import handleTasksRoute from "@routes/tasks.route";
import handleTransactionsRoute from "@routes/transactions.route";
import handleAuthRoute from "@routes/auth.route";
import handleDashboardRoute from "@routes/dashboard.route";
import ClientResponse from '@middleware/clientResponse';
import authenticate from '@middleware/auth';
import scheduler from './src/jobs/index';

scheduler();

const server = Bun.serve({
  hostname: '0.0.0.0',
  port: 3000,
  async fetch(req: Request) {

    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new ClientResponse(null, { status: 204});
    }

    if (url.pathname.startsWith('/status')) {
      return new ClientResponse(null, { status: 204 });
    } else if(url.pathname.startsWith('/login')) {
      return handleAuthRoute(req);
    }

    // Authenticate tasks
    const authResponse = await authenticate(req);

    if (authResponse instanceof ClientResponse && authResponse.status === 401) {
      return authResponse;
    }

    if(url.pathname.startsWith('/tasks')) {
      return handleTasksRoute(req);
    }

    if(url.pathname.startsWith('/transactions') || url.pathname.startsWith('/expenses')) {
      return handleTransactionsRoute(req);
    }

    if(url.pathname.startsWith('/dashboard')) {
      return handleDashboardRoute(req);
    }

    return new ClientResponse(null, { status: 404 });
  },
});

console.info(`Listening on http://localhost:${server.port}`)