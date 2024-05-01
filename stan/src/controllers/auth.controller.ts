import db from "@db/supabase.manager";
import ClientResponse
 from "@middleware/clientResponse";
const handleLogin = async (req: Request): Promise<Response> => {
    const { email, password } = await req.json(); // Extract email and password from request body

    console.log('its in the controller')
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

    console.log('data', data);

    if (error) {
        return new ClientResponse(JSON.stringify({ error: error.message }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    console.log(JSON.stringify({ message: 'Login successful', ...data }))
    // Optionally handle the session and user data here
    return new ClientResponse(JSON.stringify({ message: 'Login successful', ...data }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

export default {
    handleLogin
}