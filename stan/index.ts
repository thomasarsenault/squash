import * as dotenv from 'dotenv';
dotenv.config();

import handleTasksRoute from "@routes/tasks.route";
import ClientResponse from '@middleware/clientResponse';

const server = Bun.serve({
  hostname: '0.0.0.0',
  port: 3000,
  fetch(req: Request) {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new ClientResponse(null, { status: 204});
    }

    if(url.pathname.startsWith('/tasks')) {
      return handleTasksRoute(req);
    } else if (url.pathname.startsWith('/status')) {
      return new ClientResponse(null, { status: 204 });
    }

    return new ClientResponse(null, { status: 404 });
  },
});

console.info(`Listening on http://localhost:${server.port}`)