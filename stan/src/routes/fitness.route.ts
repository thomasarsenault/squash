import fitnessController from "@controllers/fitness.controller";
import ClientResponse from "@middleware/clientResponse";

const handleFitnessRoute = async (req: Request): Promise<Response> => {
  
  const url = new URL(req.url);

  if(url.pathname === '/fitness') {
    if(req.method === 'GET') {
      return fitnessController.getWorkouts(req);
    } else if(req.method === 'POST') {
      return fitnessController.createWorkout(req);
    } else if(req.method === 'DELETE') {
      return fitnessController.deleteWorkout(req);
    } else if(req.method === 'PUT') {
      return fitnessController.updateWorkout(req);
    }
  }


  return new ClientResponse(null, { status: 404 });
}

export default handleFitnessRoute;