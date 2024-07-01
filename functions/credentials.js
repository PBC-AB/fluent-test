export async function onRequest(context){;

    const { request } = context;
    const validURL = "https://fluent-test.pages.dev/";

    if(request.method === 'POST'){
        
        let refererURL = request.headers.referer;
        if( refererURL == validURL){

            const envVar = context.env.AUTH_ENDPOINT_BUTTON;

            const responseMessage = `Env: ${envVar}`
            return new Response(responseMessage, {
                headers: {'Content-Type' : 'application/json'},
            });
        }

        return new Response('URL not allowed:' + data, {status: 405});
 
    }

    return new Response('Method not allowed', {status: 405});
}