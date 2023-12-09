import tasksController from "@controllers/tasks.controller";
import ClientResponse from "@middleware/clientResponse";

const handleTasksRoute = async (req: Request): Promise<Response> => {
  
  const url = new URL(req.url);

  if(url.pathname === '/tasks' && req.method === 'GET') {
    return tasksController.getTasks(req);
  } else if (url.pathname === '/tasks' && req.method === 'POST') {
    return tasksController.createTask(req);
  } else if (url.pathname === '/tasks' && req.method === 'DELETE') {
    return tasksController.deleteTask(req);
  }

  return new ClientResponse(null, { status: 404 });
}

export default handleTasksRoute;