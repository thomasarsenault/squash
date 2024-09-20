import db from "@db/supabase.manager";
import ClientResponse
 from "@middleware/clientResponse";
const handleLogin = async (req: Request): Promise<Response> => {
    const { email, password } = await req.json() as any; // Extract email and password from request body

    console.log(email);
    console.log(password);
    if (!email || !password) {
        return new ClientResponse(JSON.stringify({ error: "Email and password are required" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const { data, error } = await db.auth.signInWithPassword({
        email: email,
        password: password
    });

    // clear the storage with GoTrueClient._removeSession()
    // stupid workaround because the session sent to all of the next DB calls will have the wrong? auth for some reason
    // my janky auth will just make sure its a token that decodes w/ the Supabase JWT secret
    await db.auth.signOut({scope: 'global'})

    if (error) {
        return new ClientResponse(JSON.stringify({ error: error.message }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    console.log(JSON.stringify({ message: 'Login successful', ...data }))

    return new ClientResponse(JSON.stringify({ message: 'Login successful', ...data }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

export default {
    handleLogin
}