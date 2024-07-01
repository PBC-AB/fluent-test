export async function onRequest(context){;

    const { request } = context;

    // Change to context.env.APP_URL_BUTTON
    // Create ENV Variable
    const validURL = "https://fluent-test.pages.dev/"; 

    if(request.method === 'POST'){
        
        let refererURL = request.headers.get('referer');
        if( refererURL == validURL){

            const authUrl = context.env.AUTH_ENDPOINT_BUTTON;
            const restUrl = context.env.REST_ENDPOINT_BUTTON;
            const secretId = context.env.WEBAPPCLIENT_SECRET_BUTTON;
            const clientId = context.env.WEBAPP_CLIENTID_BUTTON;

            const data = {
                authEndpoint : authUrl,
                restEndpoint : restUrl,
                webAppClientSecret : secretId,
                webAppClientId : clientId
            };

            return new Response(JSON.stringify(data), {headers: {'Content-Type' : 'text/plain'}});
        }

        return new Response('Conflict:' + refererURL, {status: 409});
    }

    return new Response('Method not allowed', {status: 405});
}