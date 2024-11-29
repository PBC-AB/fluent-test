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

        return new Response('Conflict:' + JSON.stringify(urlDebug), {status: 409});
    }

    return new Response('Method not allowed', {status: 405});
}

// This function handles requests for retrieving credentials needed for authentication
/*export async function onRequest(context){;

    const { request } = context;

    // Normalize the valid URL by creating a URL object and getting its origin
    const validURL = new URL(context.env.APP_URL_BUTTON).origin;

    const urlDebug = {
        validURL : validURL,
        originURL : "",
        refererURL : ""
    };

    // Only allow POST requests
    if(request.method === 'POST'){
        
        // Get the origin URL from request headers
        const originURL = request.headers.get('origin');
        const refererURL = request.headers.get('referer');

        urlDebug.originURL = originURL;
        urlDebug.refererURL = refererURL;
        
        // Compare normalized URLs to validate request origin
        if(originURL === validURL){

            // Get authentication credentials from environment variables
            const authUrl = context.env.AUTH_ENDPOINT_BUTTON;
            const restUrl = context.env.REST_ENDPOINT_BUTTON;
            const secretId = context.env.WEBAPPCLIENT_SECRET_BUTTON;
            const clientId = context.env.WEBAPP_CLIENTID_BUTTON;

            // Construct response data object with credentials
            const data = {
                authEndpoint : authUrl,
                restEndpoint : restUrl,
                webAppClientSecret : secretId,
                webAppClientId : clientId,
                status : "OK"
            };

            // Return credentials as JSON response
            return new Response(JSON.stringify(data), {headers: {'Content-Type' : 'text/plain'}});
        }

        // Return conflict error if origin URL doesn't match
        return new Response('URL Conflict: ' + JSON.stringify(urlDebug), {status: 409});
    }

    // Return method not allowed error for non-POST requests
    return new Response('Method not allowed', {status: 405});
}*/