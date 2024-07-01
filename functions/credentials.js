export async function onRequest(context){;

    const { request } = context;

    if(request.method === 'POST'){
        const data = await request.json();
        const envVar = context.env.AUTH_ENDPOINT_BUTTON;

        const responseMessage = `Received: ${JSON.stringify(data)}, Env: ${envVar}`

        return new Response(responseMessage, {
            headers: {'Content-Type' : 'application/json'},
        });
    }

    return new Response('Method not allowed', {status: 405});
}