export async function onRequest(context){;

    const { request } = context;
    const validURL = "https://fluent-test.pages.dev/";

    if(request.method === 'POST'){
        const data = await request.json();

        if( data == validURL){
            const envVar = context.env.AUTH_ENDPOINT_BUTTON;
            console.log(data)
            const responseMessage = `Received: ${JSON.stringify(data)}, Env: ${envVar}`
            return new Response(responseMessage, {
                headers: {'Content-Type' : 'application/json'},
            });
        }

        return new Response('URL not allowed', {status: 405});
 
    }

    return new Response('Method not allowed', {status: 405});
}