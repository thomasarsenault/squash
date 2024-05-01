import authController from "@controllers/auth.controller";
import ClientResponse from "@middleware/clientResponse";

const handleAuthRoute = async (req: Request): Promise<Response> => {
  
  const url = new URL(req.url);

  console.log('gets into the auth route just fine')
  if(url.pathname === '/login' && req.method === 'POST') {
    return authController.handleLogin(req);
  }

  return new ClientResponse(null, { status: 404 });
}

export default handleAuthRoute;