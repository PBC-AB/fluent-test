export async function onRequest(context){;

    const { request } = context;

    const validURL = context.env.APP_URL_BUTTON; 

    const urlDebug = {
        validURL : validURL,
        originURL : "",
        refererURL : ""
    };

    if(request.method === 'POST'){
        
        // Get the origin URL from request headers
        let originURL = request.headers.get('origin');
        let refererURL = request.headers.get('referer');

        urlDebug.originURL = originURL;
        urlDebug.refererURL = refererURL;

        if(refererURL == validURL){

            const authUrl = context.env.AUTH_ENDPOINT_BUTTON;
            const restUrl = context.env.REST_ENDPOINT_BUTTON;
            const secretId = context.env.WEBAPPCLIENT_SECRET_BUTTON;
            const clientId = context.env.WEBAPP_CLIENTID_BUTTON;

            const data = {
                authEndpoint : authUrl,
                restEndpoint : restUrl,
                webAppClientSecret : secretId,
                webAppClientId : clientId,
                urlDebug : urlDebug
            };

            return new Response(JSON.stringify(data), {headers: {'Content-Type' : 'text/plain'}});
        }

        return new Response('Conflict:' + JSON.stringify(urlDebug), {status: 409});
    }

    return new Response('Method not allowed', {status: 405});
}
