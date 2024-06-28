import tasksController from "@controllers/tasks.controller";
import ClientResponse from "@middleware/clientResponse";

const handleTasksRoute = async (req: Request): Promise<Response> => {
  
  const url = new URL(req.url);

  // TODO: refactor this if statement
  if(url.pathname === '/tasks' && req.method === 'GET') {
    return tasksController.getTasks(req);
  } else if (url.pathname === '/tasks' && req.method === 'POST') {
    return tasksController.createTask(req);
  } else if (url.pathname === '/tasks' && req.method === 'DELETE') {
    return tasksController.deleteTask(req);
  } else if (url.pathname === '/tasks' && req.method === 'PUT') {
    return tasksController.updateTask(req);
  } else if (url.pathname === '/tasks_ranks' && req.method === 'GET') {
    return tasksController.getTaskRanks(req);
  } else if (url.pathname === '/tasks_ranks' && req.method === 'PUT') {
    return tasksController.updateTaskRanks(req);
  }

  return new ClientResponse(null, { status: 404 });
}

export default handleTasksRoute;