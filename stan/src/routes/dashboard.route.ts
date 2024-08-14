import ClientResponse from "@middleware/clientResponse";
import dashboardController from "@controllers/dashboard.controller";

const handleDashboardRoute = async (req: Request): Promise<Response> => {
  
  const url = new URL(req.url);

  if(url.pathname === '/dashboard') {
    if(req.method === 'GET') {
      return dashboardController.getDashboard(req);
    }
  }

  return new ClientResponse(null, { status: 404 });
}

export default handleDashboardRoute;