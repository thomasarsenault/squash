import tasksController from "@controllers/tasks.legacy.controller";
import ClientResponse from "@middleware/clientResponse";

const handleTasksRoute = async (req: Request): Promise<Response> => {
  
  const url = new URL(req.url);

  if(url.pathname === '/tasks_legacy') {
    if(req.method === 'GET') {
      return tasksController.getTasks(req);
    } else if (req.method === 'POST') {
      return tasksController.createTask(req);
    } else if (req.method === 'DELETE') {
      return tasksController.deleteTask(req);
    }
  }

  if(url.pathname === '/tasks_ranks_legacy') {
    if(req.method === 'GET') {
      return tasksController.getTaskRanks(req);
    } else if (req.method === 'PUT') {
      return tasksController.updateTaskRanks(req);
    }
  }

  return new ClientResponse(null, { status: 404 });
}

export default handleTasksRoute;