import jwt from 'jsonwebtoken';
import db from "@db/supabase.manager";
import ClientResponse from "@middleware/clientResponse";

const authenticate = async (req: Request) => {
    const token = req.headers.get("Authorization")?.split(" ")[1]; // Assuming Bearer token

    if (!token) {
      return new ClientResponse(JSON.stringify({ error: "No token provided" }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
  
    try {
        const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
        // req.user = decoded; // decoded token will have user information
        // Continue with your route processing
    } catch (error) {
        return new ClientResponse(JSON.stringify({ error: "Invalid or expired token" }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
  };
  
  export default authenticate;